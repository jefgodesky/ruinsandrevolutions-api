CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ITEM_TYPE') THEN
        CREATE TYPE ITEM_TYPE AS ENUM ('scale', 'scroll', 'table');
    END IF;
END
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    type ITEM_TYPE,
    description VARCHAR(255),
    body TEXT,
    attribution TEXT,
    data JSONB,
    created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
