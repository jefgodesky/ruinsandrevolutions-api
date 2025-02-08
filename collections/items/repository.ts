import type ItemRecord from '../../types/item-record.ts'
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
}
