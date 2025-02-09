import * as uuid from '@std/uuid'
import ItemRecord, { type ItemRecordWithAuthors } from '../../types/item-record.ts'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'

export default class ItemRepository {
  async save (record: ItemRecord, authors: User[]): Promise<ItemRecord | null> {
    if (!record.id) return await this.create(record, authors)
    return null
  }

  async create (record: ItemRecord, authors: User[]): Promise<ItemRecord | null> {
    const { name, slug, type, description, body, attribution, data } = record
    const query = 'INSERT INTO items (name, slug, type, description, body, attribution, data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    const result = await DB.query<ItemRecord>(query, [name, slug, type, description, body, attribution, JSON.stringify(data)])
    if (result.warnings.length > 0) return null

    const saved = result.rows[0]
    for (const author of authors) {
      const query = 'INSERT INTO item_authors (uid, iid) VALUES ($1, $2)'
      await DB.query(query, [author.id, saved.id])
    }

    return saved
  }

  async get (id: string): Promise<ItemRecordWithAuthors | null> {
    if (!uuid.v4.validate(id)) return null
    return await this.getByUniqueField('i.id = $1', [id])
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
