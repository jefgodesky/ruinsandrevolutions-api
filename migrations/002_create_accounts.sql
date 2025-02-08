CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PROVIDER') THEN
        CREATE TYPE PROVIDER AS ENUM ('google', 'discord', 'github');
    END IF;
END
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid UUID REFERENCES users (id) ON DELETE CASCADE,
    provider PROVIDER,
    pid VARCHAR(255)
);
