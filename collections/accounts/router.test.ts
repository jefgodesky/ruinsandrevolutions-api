import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import AccountRepository from './repository.ts'
import DB from '../../DB.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import getSupertestRoot from '../../utils/testing/get-supertest-root.ts'

describe('/accounts', () => {
  afterEach(DB.clear)
  afterAll(DB.close)

  describe('Collection [/accounts]', () => {
    describe('POST', () => {
      it('returns 401 if not authenticated', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/accounts')
          .set({'Content-Type': 'application/vnd.api+json'})
          .send({
            data: {
              type: 'tokens',
              attributes: {
                token: 'nope'
              }
            }
          })

        expect(res.status).toBe(401)
      })

      it('returns 400 if given a bad token', async () => {
        const { jwt } = await setupUser()
        const res = await supertest(getSupertestRoot())
          .post('/accounts')
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send({
            data: {
              type: 'tokens',
              attributes: {
                token: 'nope'
              }
            }
          })

        expect(res.status).toBe(400)
      })
    })

    describe('GET', () => {
      it('returns 401 if not authenticated', async () => {
        const res = await supertest(getSupertestRoot())
          .get('/accounts')
          .set({'Content-Type': 'application/vnd.api+json'})

        expect(res.status).toBe(401)
      })

      it('returns a list of providers', async () => {
        const { account, jwt } = await setupUser()
        const res = await supertest(getSupertestRoot())
          .get('/accounts')
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })

        expect(res.status).toBe(200)
        expect(res.body.data).toHaveLength(1)
        expect(res.body.data[0].type).toBe('provider')
        expect(res.body.data[0].id).toBe(account!.provider)
      })
    })

    describe('Unallowed methods', () => {
      it('returns 405 on unallowed methods', async () => {
        const { jwt } = await setupUser()
        const path = '/accounts'
        const methods = [
          supertest(getSupertestRoot()).put(path),
          supertest(getSupertestRoot()).patch(path),
          supertest(getSupertestRoot()).delete(path)
        ]

        for (const method of methods) {
          const res = await method
            .set({
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/vnd.api+json'
            })

          const expected = ['GET', 'HEAD', 'POST']
          const actual = res.headers.allow.split(',').map((m: string) => m.trim())
          expect(res.status).toBe(405)
          expect(expected.every(m => actual.includes(m))).toBe(true)
        }
      })
    })
  })

  describe('Resource [/accounts/:provider]', () => {
    describe('GET', () => {
      it('returns 401 if not authenticated', async () => {
        const { account } = await setupUser()
        const res = await supertest(getSupertestRoot())
          .get(`/accounts/${account!.provider}`)
          .set({'Content-Type': 'application/vnd.api+json'})

        expect(res.status).toBe(401)
      })

      it('returns the provider', async () => {
        const { account, jwt } = await setupUser()
        const res = await supertest(getSupertestRoot())
          .get(`/accounts/${account!.provider}`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })

        expect(res.status).toBe(200)
        expect(res.body.data.type).toBe('provider')
        expect(res.body.data.id).toBe(account!.provider)
      })
    })

    describe('DELETE', () => {
      it('returns 401 if not authenticated', async () => {
        const { account } = await setupUser()
        const res = await supertest(getSupertestRoot())
          .delete(`/accounts/${account!.provider}`)
          .set({'Content-Type': 'application/vnd.api+json'})

        expect(res.status).toBe(401)
      })

      it('deletes the account', async () => {
        const { account, jwt } = await setupUser()
        const res = await supertest(getSupertestRoot())
          .delete(`/accounts/${account!.provider}`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })

        const accounts = new AccountRepository()
        const check = await accounts.get(account?.id ?? '')

        expect(res.status).toBe(204)
        expect(account?.id).toBeDefined()
        expect(check).toBeNull()
      })
    })

    describe('Unallowed methods', () => {
      it('returns 405 on unallowed methods', async () => {
        const { account, jwt } = await setupUser()
        const path = `/accounts/${account!.provider}`
        const methods = [
          supertest(getSupertestRoot()).post(path),
          supertest(getSupertestRoot()).put(path),
          supertest(getSupertestRoot()).patch(path)
        ]

        for (const method of methods) {
          const res = await method
            .set({
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/vnd.api+json'
            })

          const expected = ['GET', 'HEAD', 'DELETE']
          const actual = res.headers.allow.split(',').map((m: string) => m.trim())
          expect(res.status).toBe(405)
          expect(expected.every(m => actual.includes(m))).toBe(true)
        }
      })
    })
  })
})
