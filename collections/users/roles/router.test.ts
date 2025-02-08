import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import type User from '../../../types/user.ts'
import DB from '../../../DB.ts'
import RoleRepository from './repository.ts'
import authTokenToJWT from "../../../utils/transformers/auth-token-to/jwt.ts"
import getSupertestRoot from '../../../utils/testing/get-supertest-root.ts'
import setupUser from '../../../utils/testing/setup-user.ts'

describe('/users/:userId/roles', () => {
  let user: User
  let repository: RoleRepository
  let admin: string
  let self: string
  let other: string

  beforeEach(async () => {
    repository = new RoleRepository()
    const data = await setupUser()
    user = data.user
    self = await authTokenToJWT(data.token!)

    const { token } = await setupUser({ name: 'Jane Doe', username: 'jane' })
    other = await authTokenToJWT(token!)

    const a = await setupUser({ name: 'Admin', username: 'admin' })
    a.token!.user.roles = ['active', 'listed', 'admin']
    admin = await authTokenToJWT(a.token!)
  })

  afterEach(DB.clear)
  afterAll(DB.close)

  describe('Resource [/users/:userId/roles/:role]', () => {
    describe('POST', () => {
      it('returns 401 if unauthenticated user tries', async () => {
        const res = await supertest(getSupertestRoot())
          .post(`/users/${user.id}/roles/admin`)

        const check = await repository.has(user.id!, 'admin')
        expect(res.status).toBe(401)
        expect(check).toBe(false)
      })

      it('returns 403 if user tries without permission', async () => {
        const res = await supertest(getSupertestRoot())
          .post(`/users/${user.id}/roles/admin`)
          .set({
            Authorization: `Bearer ${other}`
          })

        const check = await repository.has(user.id!, 'admin')
        expect(res.status).toBe(403)
        expect(check).toBe(false)
      })

      it('returns 404 if the user cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .post(`/users/${crypto.randomUUID()}/roles/admin`)
          .set({
            Authorization: `Bearer ${admin}`
          })

        const check = await repository.has(user.id!, 'admin')
        expect(res.status).toBe(404)
        expect(check).toBe(false)
      })

      it('returns 404 if the username cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .post(`/users/lol-nope/roles/admin`)
          .set({
            Authorization: `Bearer ${admin}`
          })

        const check = await repository.has(user.id!, 'admin')
        expect(res.status).toBe(404)
        expect(check).toBe(false)
      })

      it('grants role', async () => {
        const ids = [user.id, user.username]
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .post(`/users/${id}/roles/admin`)
            .set({
              Authorization: `Bearer ${admin}`
            })

          const check = await repository.has(user.id!, 'admin')
          expect(res.status).toBe(204)
          expect(check).toBe(true)
        }
      })

      it('lets user grant self listed role', async () => {
        const ids = [user.id, user.username]
        for (const id of ids) {
          await repository.revoke(user.id!, 'listed')
          const res = await supertest(getSupertestRoot())
            .post(`/users/${id}/roles/listed`)
            .set({
              Authorization: `Bearer ${self}`
            })

          const check = await repository.has(user.id!, 'listed')
          expect(res.status).toBe(204)
          expect(check).toBe(true)
        }
      })
    })

    describe('DELETE', () => {
      it('returns 401 if unauthenticated user tries', async () => {
        const res = await supertest(getSupertestRoot())
          .delete(`/users/${user.id}/roles/active`)

        const check = await repository.has(user.id!, 'active')
        expect(res.status).toBe(401)
        expect(check).toBe(true)
      })

      it('returns 403 if user tries without permission', async () => {
        const res = await supertest(getSupertestRoot())
          .delete(`/users/${user.id}/roles/active`)
          .set({
            Authorization: `Bearer ${other}`
          })

        const check = await repository.has(user.id!, 'active')
        expect(res.status).toBe(403)
        expect(check).toBe(true)
      })

      it('returns 404 if the user ID cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .delete(`/users/${crypto.randomUUID()}/roles/active`)
          .set({
            Authorization: `Bearer ${admin}`
          })

        const check = await repository.has(user.id!, 'active')
        expect(res.status).toBe(404)
        expect(check).toBe(true)
      })

      it('returns 404 if the username cannot be found', async () => {
        const res = await supertest(getSupertestRoot())
          .delete(`/users/lol-nope/roles/active`)
          .set({
            Authorization: `Bearer ${admin}`
          })

        const check = await repository.has(user.id!, 'active')
        expect(res.status).toBe(404)
        expect(check).toBe(true)
      })

      it('revokes role', async () => {
        const ids = [user.id, user.username]
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .delete(`/users/${id}/roles/active`)
            .set({
              Authorization: `Bearer ${admin}`
            })

          const check = await repository.has(user.id!, 'active')
          expect(res.status).toBe(204)
          expect(check).toBe(false)
        }
      })

      it('lets user revoke self listed role', async () => {
        const ids = [user.id, user.username]
        for (const id of ids) {
          await repository.grant(user.id!, 'listed')
          const res = await supertest(getSupertestRoot())
            .delete(`/users/${id}/roles/listed`)
            .set({
              Authorization: `Bearer ${self}`
            })

          const check = await repository.has(user.id!, 'listed')
          expect(res.status).toBe(204)
          expect(check).toBe(false)
        }
      })
    })
  })
})
