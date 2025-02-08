import * as uuid from '@std/uuid'
import DB from '../../../DB.ts'

export default class RoleRepository {
  async userExists (uid: string): Promise<boolean> {
    if (!uuid.v4.validate(uid)) return false
    return await DB.exists('SELECT id FROM users WHERE id = $1', [uid])
  }

  async get (uid: string): Promise<string[] | null> {
    if (!await this.userExists(uid)) return null
    const query = 'SELECT role FROM roles WHERE uid = $1'
    const res = await DB.query<{  role: string }>(query, [uid])
    return res.rows.map(row => row.role)
  }

  async has (uid: string, role: string): Promise<boolean | null> {
    if (!await this.userExists(uid)) return null
    const query = 'SELECT id FROM roles WHERE uid = $1 AND role = $2'
    const res = await DB.query(query, [uid, role])
    return res.rowCount !== undefined && res.rowCount > 0
  }

  async grant (uid: string, role: string): Promise<boolean | null> {
    if (!await this.userExists(uid)) return null
    if (await this.has(uid, role)) return true
    const query = 'INSERT INTO roles (uid, role) VALUES ($1, $2)'
    const res = await DB.query(query, [uid, role])
    return res.rowCount !== undefined && res.rowCount > 0
  }

  async revoke (uid: string, role: string): Promise<boolean | null> {
    if (!await this.userExists(uid)) return null
    const query = 'DELETE FROM roles WHERE uid = $1 AND role = $2'
    const res = await DB.query(query, [uid, role])
    return res.rowCount !== undefined && res.rowCount > 0
  }
}
