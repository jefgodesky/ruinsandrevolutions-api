#!/bin/sh
set -e

echo "Waiting for database to be ready..."
MAX_RETRIES=30
RETRIES=0

while [ $RETRIES -lt $MAX_RETRIES ]; do
  if PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT 1" >/dev/null 2>&1; then
    echo "Database is ready"
    break
  fi

  RETRIES=$((RETRIES + 1))
  echo "Waiting for postgres server, attempt $RETRIES of $MAX_RETRIES..."
  sleep 2

  if [ $RETRIES -eq $MAX_RETRIES ]; then
    echo "Failed to connect to database after $MAX_RETRIES attempts"
    exit 1
  fi
done

echo "Running database migrations..."
TOKEN_EXPIRATION="${TOKEN_EXPIRATION:-'10 minutes'}"
REFRESH_EXPIRATION="${REFRESH_EXPIRATION:-'7 days'}"

for sql_file in /app/migrations/*.sql; do
  echo "Running $sql_file"
  sed -e "s|\$TOKEN_EXPIRATION|'$TOKEN_EXPIRATION'|g" \
      -e "s|\$REFRESH_EXPIRATION|'$REFRESH_EXPIRATION'|g" \
      "$sql_file" > /tmp/interpolated.sql
  PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -f /tmp/interpolated.sql
done

echo "Migrations completed successfully"

if [ "$ENV" = "dev" ]; then
  echo "Starting API in development mode..."
  exec deno task dev:start
else
  echo "Starting API..."
  exec deno task start
fi
