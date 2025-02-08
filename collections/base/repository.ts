import * as uuid from '@std/uuid'
import type Model from '../../types/model.ts'
import DB from '../../DB.ts'

export default abstract class Repository<T extends Model> {
  protected tableName: string

  protected constructor (tableName: string) {
    this.tableName = tableName
  }

  async list (limit?: number, offset?: number): Promise<{ total: number, rows: T[] }> {
    return await DB.list<T>(this.tableName, { offset, limit })
  }

  async get (id: string): Promise<T | null> {
    if (!uuid.v4.validate(id)) return null
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
    return await DB.get(query, [id])
  }

  async save (record: T): Promise<T | null> {
    if (record.id) return await this.update(record)
    return await this.create(record)
  }

  async delete (id: string): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`
    await DB.query(query, [id])
  }

  protected async update (record: T): Promise<T | null> {
    const keys = Object.keys(record).filter((key) => key !== 'id')
    // deno-lint-ignore no-explicit-any
    const values = keys.map((key) => (record as any)[key])
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(", ")
    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 RETURNING *`
    const result = await DB.query<T>(query, [record.id, ...values])
    return result.warnings.length === 0 ? result.rows[0] : null
  }

  protected async create (record: T): Promise<T | null> {
    const keys = Object.keys(record)
    // deno-lint-ignore no-explicit-any
    const values = keys.map((key) => (record as any)[key])
    const columns = keys.join(', ')
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')
    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`
    const result = await DB.query<T>(query, values)
    return result.warnings.length === 0 ? result.rows[0] : null
  }
}
