import * as uuid from '@std/uuid'
import { verify } from '@stdext/crypto/hash'
import type AuthTokenRecord from '../../../types/auth-token-record.ts'
import Repository from '../../base/repository.ts'
import UserRepository from '../../users/repository.ts'
import addRoles from '../../../utils/add-roles.ts'
import getTokenExpiration from '../../../utils/get-token-expiration.ts'
import DB, { MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from '../../../DB.ts'

export default class AuthTokenRepository extends Repository<AuthTokenRecord> {
  constructor () {
    super('tokens')
  }

  override async get (id: string): Promise<AuthTokenRecord | null> {
    if (!uuid.v4.validate(id)) return null
    const record = await super.get(id)
    if (!record) return null

    const users = new UserRepository()
    const user = await users.get(record.uid)
    if (!user) return null

    const loaded = await addRoles(user)
    return loaded.roles && loaded.roles.includes('active') ? record : null
  }

  override async list (
    limit: number = DEFAULT_PAGE_SIZE,
    offset: number = 0
  ): Promise<{ total: number, rows: AuthTokenRecord[] }> {
    const params = [Math.min(MAX_PAGE_SIZE, limit), offset]
    const query = `
    SELECT t.*, COUNT(*) OVER() AS total
    FROM tokens t
    JOIN users u ON t.uid = u.id
    WHERE u.id IN (
        SELECT r.uid
        FROM roles r
        WHERE r.role = 'active'
        INTERSECT
        SELECT r.uid
        FROM roles r
        WHERE r.role = 'listed'
    )
    LIMIT $1 OFFSET $2;
    `
    const result = await DB.query<{ total: number } & AuthTokenRecord>(query, params)
    const total = Number(result.rows[0]?.total ?? 0)
    // deno-lint-ignore no-unused-vars
    const rows = result.rows.map(({ total, ...row }) => row as unknown as AuthTokenRecord)
    return { total, rows }
  }

  override async create (record: AuthTokenRecord): Promise<AuthTokenRecord | null> {
    const check = await DB.exists('SELECT id FROM roles WHERE uid = $1 AND role = \'active\'', [record.uid])
    if (!check) return null
    return super.create(record)
  }

  async exchange (token: AuthTokenRecord): Promise<AuthTokenRecord | null> {
    if (!token.id) return null
    const stored = await this.get(token.id)
    if (!stored) return null

    let verified = false
    try {
      verified = verify('argon2', stored.refresh, token.refresh)
    // deno-lint-ignore no-empty
    } catch {}

    if (!verified) return null
    await this.delete(token.id)

    return await this.create({
      uid: token.uid,
      refresh: crypto.randomUUID(),
      token_expiration: getTokenExpiration(),
      refresh_expiration: token.refresh_expiration
    })
  }

  async listByUserID (uid: string, limit?: number, offset?: number): Promise<{ total: number, rows: AuthTokenRecord[] }> {
    return await DB.list<AuthTokenRecord>(this.tableName, {
      where: 'uid = $1',
      params: [uid],
      limit,
      offset
    })
  }
}
