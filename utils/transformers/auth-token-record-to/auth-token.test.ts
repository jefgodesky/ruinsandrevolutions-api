import { describe, beforeEach, afterEach, afterAll, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { verify } from '@stdext/crypto/hash'
import type AuthTokenRecord from '../../../types/auth-token-record.ts'
import type User from '../../../types/user.ts'
import DB from '../../../DB.ts'
import getTokenExpiration from '../../get-token-expiration.ts'
import getRefreshExpiration from '../../get-refresh-expiration.ts'
import getRoleConfig from '../../get-role-config.ts'
import setupUser from '../../testing/setup-user.ts'
import authTokenRecordToAuthToken from './auth-token.ts'

describe('authTokenRecordToAuthToken', () => {
  let user: User

  beforeEach(async () => {
    ({ user } = await setupUser({ createAccount: false, createToken: false }))
  })

  afterEach(DB.clear)
  afterAll(DB.close)

  it('returns null if user cannot be found', async () => {
    const record: AuthTokenRecord = {
      id: crypto.randomUUID(),
      uid: crypto.randomUUID(),
      refresh: crypto.randomUUID(),
      token_expiration: getTokenExpiration(),
      refresh_expiration: getRefreshExpiration()
    }

    const actual = await authTokenRecordToAuthToken(record)
    expect(actual).toBeNull()
  })

  it('turns an AuthTokenRecord into an AuthToken', async () => {
    const record: AuthTokenRecord = {
      id: crypto.randomUUID(),
      uid: user.id ?? '',
      refresh: crypto.randomUUID(),
      token_expiration: getTokenExpiration(),
      refresh_expiration: getRefreshExpiration()
    }

    const actual = await authTokenRecordToAuthToken(record)
    expect(actual?.id).toBe(record.id)
    expect(actual?.user.id).toBe(user.id)
    expect(actual?.user.name).toBe(user.name)
    expect(actual?.user.roles).toEqual(getRoleConfig().default)
    expect(actual?.expiration.token).toEqual(record.token_expiration)
    expect(actual?.expiration.refresh).toEqual(record.refresh_expiration)

    try {
      const verified = verify('argon2', record.refresh, actual?.refresh ?? '')
      expect(verified).toBe(true)
    } catch {
      expect('Refresh token hash verification failed.').toBe(true)
    }
  })
})
