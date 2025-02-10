import * as uuid from '@std/uuid'
import ItemRecord, { type ItemRecordWithAuthors, type ItemType } from '../../types/item-record.ts'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'
import getEnvNumber from '../../utils/get-env-number.ts'

const MAX_PAGE_SIZE = getEnvNumber('MAX_PAGE_SIZE', 100)
const DEFAULT_PAGE_SIZE = getEnvNumber('DEFAULT_PAGE_SIZE', 10)

export default class ItemRepository {
  async save (record: ItemRecord, authors: User[]): Promise<ItemRecord | null> {
    if (!record.id) return await this.create(record, authors)
    return await this.update(record, authors)
  }

  async create (record: ItemRecord, authors: User[]): Promise<ItemRecord | null> {
    const { name, slug, type, description, body, attribution, data } = record
    const query = 'INSERT INTO items (name, slug, type, description, body, attribution, data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    const result = await DB.query<ItemRecord>(query, [name, slug, type, description, body, attribution, JSON.stringify(data)])
    if (result.warnings.length > 0) return null

    const saved = result.rows[0]
    await this.setAuthors(saved.id ?? 'ERROR', authors)
    return saved
  }

  async get (id: string): Promise<ItemRecordWithAuthors | null> {
    if (!uuid.v4.validate(id)) return null
    return await this.getByUniqueField('i.id = $1', [id])
  }

  async getBySlug (itemType: ItemType, slug: string): Promise<ItemRecordWithAuthors | null> {
    return await this.getByUniqueField('i.type = $1 AND i.slug = $2', [itemType, slug])
  }

  async getByIdOrSlug (itemType: ItemType, id: string): Promise<ItemRecordWithAuthors | null> {
    if (uuid.v4.validate(id)) return await this.get(id)
    return await this.getBySlug(itemType, id)
  }

  async list (
    limit: number = DEFAULT_PAGE_SIZE,
    offset: number = 0,
    where: string = 'TRUE',
    sort: string = 'i.updated DESC',
    params: string[] = []
  ): Promise<{ total: number, rows: ItemRecordWithAuthors[] }> {
    limit = Math.min(limit, MAX_PAGE_SIZE)

    const query = `
      WITH paginated_items AS (
        SELECT 
          i.*, 
          COUNT(*) OVER () AS total,
          COALESCE(
            jsonb_agg(jsonb_build_object('id', u.id, 'name', u.name, 'username', u.username))
            FILTER (WHERE u.id IS NOT NULL AND r.role = 'listed'), '[]'
          ) AS authors
        FROM items i
        LEFT JOIN item_authors ia ON i.id = ia.iid
        LEFT JOIN users u ON ia.uid = u.id
        LEFT JOIN roles r ON u.id = r.uid
        WHERE ${where}
        GROUP BY i.id
        ORDER BY ${sort}
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      )
      SELECT * FROM paginated_items;
    `

    const result = await DB.query<ItemRecordWithAuthors & { total: number }>(query, [...params, limit, offset])
    const total = result.rows.length > 0 ? Number(result.rows[0].total) : 0
    return { total, rows: result.rows }
  }

  async update (record: ItemRecord, authors?: User[]): Promise<ItemRecord | null> {
    const { id, slug, name, description, body, attribution, data } = record
    if (id === undefined) return null
    const fieldsObj: Record<string, string | undefined> = { slug, name, description, body, attribution }
    const params = [JSON.stringify(data), new Date(), id]
    const fields: string[] = []
    for (const field in fieldsObj) {
      if (fieldsObj[field] !== undefined) {
        fields.push(`${field} = $${params.length + 1}`)
        params.push(fieldsObj[field])
      }
    }

    const query = `UPDATE items SET ${fields.join(', ')}, data = $1, updated = $2 WHERE id = $3  RETURNING *`
    const result = await DB.query<ItemRecord>(query, params)
    if (result.warnings.length > 0) return null
    if (authors) await this.setAuthors(id, authors, true)
    return result.rows[0]
  }

  private async setAuthors (id: string, authors: User[], isUpdate: boolean = false): Promise<void> {
    if (isUpdate) {
      const clear = 'DELETE FROM item_authors WHERE iid = $1'
      await DB.query(clear, [id])
    }

    for (const author of authors) {
      const query = 'INSERT INTO item_authors (uid, iid) VALUES ($1, $2)'
      await DB.query(query, [author.id, id])
    }
  }

  private async getByUniqueField (
    where: string,
    params: string[]
  ): Promise<ItemRecordWithAuthors | null> {
    const query = `
      SELECT 
        i.*, 
        COALESCE(
          jsonb_agg(jsonb_build_object('id', u.id, 'name', u.name, 'username', u.username))
          FILTER (WHERE u.id IS NOT NULL AND r.role = 'listed'), '[]'
        ) AS authors
      FROM items i
      LEFT JOIN item_authors ia ON i.id = ia.iid
      LEFT JOIN users u ON ia.uid = u.id
      LEFT JOIN roles r ON u.id = r.uid
      WHERE ${where}
      GROUP BY i.id
    `

    const result = await DB.query<ItemRecordWithAuthors>(query, params)
    return result.rows.length > 0 ? result.rows[0] : null
  }
}
