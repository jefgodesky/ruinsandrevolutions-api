import * as uuid from '@std/uuid'
import type Account from '../../types/account.ts'
import Provider, { PROVIDERS } from '../../types/provider.ts'
import DB from '../../DB.ts'
import Repository from '../base/repository.ts'

export default class AccountRepository extends Repository<Account> {
  constructor () {
    super('accounts')
  }

  override async save (record: Account): Promise<Account | null> {
    const check = await this.getByUIDAndProvider(record.uid, record.provider)
    if (check) return check
    return await this.create(record)
  }

  async getByUIDAndProvider (uid: string, provider: Provider): Promise<Account | null> {
    if (!uuid.v4.validate(uid)) return null
    if (!Object.values(PROVIDERS).includes(provider)) return null
    const query = `SELECT * FROM accounts WHERE uid = $1 AND provider = $2`
    return await DB.get<Account>(query, [uid, provider])
  }

  async getByProviderAndProviderID (provider: Provider, pid: string): Promise<Account | null> {
    if (!Object.values(PROVIDERS).includes(provider)) return null
    const query = `SELECT * FROM accounts WHERE provider = $1 AND pid = $2`
    return await DB.get<Account>(query, [provider, pid])
  }

  async listProviders (uid: string): Promise<Provider[]> {
    if (!uuid.v4.validate(uid)) return []
    const query = 'SELECT provider FROM accounts WHERE uid = $1'
    const accounts = await DB.query<{ provider: string }>(query, [uid])
    return accounts.rows.map(account => account.provider as Provider)
  }
}
