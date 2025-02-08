import { Pool } from 'https://deno.land/x/postgres@v0.19.3/mod.ts'
import isTest from './utils/testing/is-test.ts'
import getEnvNumber from './utils/get-env-number.ts'

const MAX_PAGE_SIZE = getEnvNumber('MAX_PAGE_SIZE', 100)
const DEFAULT_PAGE_SIZE = getEnvNumber('DEFAULT_PAGE_SIZE', 10)
const POSTGRES_POOLS = getEnvNumber('POSTGRES_POOLS', 10)

class DB {
  private static conn: DB
  private pool: Pool

  constructor () {
    this.pool = new Pool({
      user: Deno.env.get('POSTGRES_USER') || 'postgres',
      password: Deno.env.get('POSTGRES_PASSWORD') || 'password',
      database: Deno.env.get('POSTGRES_DB') || 'api_db',
      hostname: Deno.env.get('POSTGRES_HOST') || 'localhost',
      port: parseInt(Deno.env.get('POSTGRES_PORT') || '5432')
    }, POSTGRES_POOLS)
  }

  static getPool (): Pool {
    if (!DB.conn) {
      DB.conn = new DB()
    }
    return DB.conn.pool
  }

  // deno-lint-ignore no-explicit-any
  static async query<T> (query: string, params?: any[]) {
    const client = await DB.getPool().connect()
    try {
      return await client.queryObject<T>(query, params)
    } finally {
      client.release()
    }
  }

  static async clear (): Promise<void> {
    if (!isTest() || !DB.conn) return
    const query = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_type = \'BASE TABLE\''
    const result = await DB.query<{ table_name: string }>(query)
    const tables = result.rows.map((row) => row.table_name)
    if (tables.length > 0) await DB.query(`TRUNCATE TABLE ${tables.join(', ')} CASCADE;`)
  }

  static async exists (query: string, params: string[]): Promise<boolean> {
    const result = await DB.query(query, params)
    return result.rows.length > 0
  }

  static async get<T> (query: string, params: string[]): Promise<T | null> {
    const result = await DB.query<T>(query, params)
    return result.rows.length ? result.rows[0] : null
  }

  static async list<T> (
    tableName: string,
    {
      limit = DEFAULT_PAGE_SIZE,
      offset = 0,
      where = undefined,
      sort = undefined,
      params = []
    }: {
      limit?: number,
      offset?: number,
      where?: string,
      sort?: string
      params?: Array<string | number | boolean>
    } = {}
  ): Promise<{ total: number, rows: T[] }> {
    limit = Math.min(limit, MAX_PAGE_SIZE)
    let query = `SELECT *, COUNT(*) OVER() AS total FROM ${tableName}`
    if (where) query += ` WHERE ${where}`
    if (sort) query += ` ORDER BY ${sort}`

    const n = params.length + 1
    query += ` LIMIT $${n} OFFSET $${n + 1}`
    params = [...params, limit, offset]

    const result = await DB.query<{ total: number } & T>(query, params)
    const total = Number(result.rows[0]?.total ?? 0)
    // deno-lint-ignore no-unused-vars
    const rows = result.rows.map(({ total, ...row }) => row as unknown as T)
    return { total, rows }
  }

  static async close (): Promise<void> {
    if (!DB.conn) return
    await DB.conn.pool.end()
  }
}

export default DB
export {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE
}
