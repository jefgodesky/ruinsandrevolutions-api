import * as uuid from '@std/uuid'
import type User from '../../types/user.ts'
import DB, { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../../DB.ts'
import Repository from '../base/repository.ts'
import RoleRepository from './roles/repository.ts'
import getRoleConfig from '../../utils/get-role-config.ts'

export default class UserRepository extends Repository<User> {
  constructor () {
    super('users')
  }

  protected override async create (record: User): Promise<User | null> {
    const user = await super.create(record)
    if (user === null) return null
    if (!user.id) return user

    const roles = new RoleRepository()
    const defaultRoles = getRoleConfig().default
    for (const role of defaultRoles) await roles.grant(user.id, role)
    return user
  }

  override async get (id: string): Promise<User | null> {
    if (!uuid.v4.validate(id)) return null
    return await super.get(id)
  }

  override async list (limit: number = DEFAULT_PAGE_SIZE, offset?: number): Promise<{ total: number, rows: User[] }> {
    const params = [Math.min(limit, MAX_PAGE_SIZE), offset]
    const query = `
      WITH total_count AS (
        SELECT COUNT(*) AS total
        FROM users u
        JOIN roles r ON u.id = r.uid
        WHERE r.role = 'listed'
      )
      SELECT u.*, tc.total
      FROM users u
      JOIN roles r ON u.id = r.uid
      CROSS JOIN total_count tc
      WHERE r.role = 'listed'
      LIMIT $1 OFFSET $2
    `
    const result = await DB.query<{ total: number } & User>(query, params)
    const total = Number(result.rows[0]?.total ?? 0)
    // deno-lint-ignore no-unused-vars
    const rows = result.rows.map(({ total, ...row }) => row as unknown as User)
    return { total, rows }
  }

  async getByUsername (username: string): Promise<User | null> {
    if (username.length > 255) return null
    const query = 'SELECT * FROM users WHERE username = $1'
    return await DB.get(query, [username])
  }

  async getByIdOrUsername (id: string): Promise<User | null> {
    return uuid.v4.validate(id)
      ? await this.get(id)
      : await this.getByUsername(id)
  }
}
