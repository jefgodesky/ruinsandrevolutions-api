import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { Context } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import type User from '../../../types/user.ts'
import DB from '../../../DB.ts'
import RoleRepository from './repository.ts'
import setupUser from '../../../utils/testing/setup-user.ts'
import RoleController from './controller.ts'

describe('RoleController', () => {
  let user: User
  let ctx: Context
  const repository = new RoleRepository()

  beforeEach(async () => {
    ({ user } = await setupUser({ createAccount: false, createToken: false}))
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  describe('grant', () => {
    const role = 'test'

    beforeEach(() => {
      ctx = createMockContext({
        state: { user, params: { role } }
      })
    })

    it('adds a new roles', async () => {
      await RoleController.grant(ctx)
      const check = await repository.has(user.id!, role)
      expect(ctx.response.status).toBe(204)
      expect(check).toBe(true)
    })

    it('doesn\'t create duplicate roles', async () => {
      await RoleController.grant(ctx)
      await RoleController.grant(ctx)
      const check = await DB.query('SELECT id FROM roles WHERE uid = $1 AND role = $2', [user.id, role])
      expect(check.rowCount).toBe(1)
    })
  })

  describe('revoke', () => {
    const role = 'listed'

    beforeEach(() => {
      ctx = createMockContext({
        state: { user, params: { role } }
      })
    })

    it('removes a role', async () => {
      await RoleController.revoke(ctx)
      const check = await repository.has(user.id!, role)
      expect(ctx.response.status).toBe(204)
      expect(check).toBe(false)
    })
  })
})
