#!/bin/sh
set -e

TOKEN_EXPIRATION="${TOKEN_EXPIRATION:-'10 minutes'}"
REFRESH_EXPIRATION="${REFRESH_EXPIRATION:-'7 days'}"

for sql_file in /scripts/migrations/*.sql; do
  echo "Running $sql_file"
  sed -e "s|\$TOKEN_EXPIRATION|'$TOKEN_EXPIRATION'|g" \
      -e "s|\$REFRESH_EXPIRATION|'$REFRESH_EXPIRATION'|g" \
      "$sql_file" > /tmp/interpolated.sql
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /tmp/interpolated.sql
done
