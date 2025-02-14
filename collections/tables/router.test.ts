import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import type Table from '../../types/table.ts'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'
import { createTableCreation } from '../../types/table-creation.ts'
import getSupertestRoot from '../../utils/testing/get-supertest-root.ts'
import setupTables from '../../utils/testing/setup-tables.ts'
import setupUser from '../../utils/testing/setup-user.ts'

describe('/tables', () => {
  let tables: Table[]
  let table: Table
  let user: User
  let jwt: string | undefined

  afterEach(DB.clear)
  afterAll(DB.close)

  describe('Collection [/tables]', () => {
    describe('POST', () => {
      beforeEach(async () => {
        ({user, jwt} = await setupUser({ createAccount: false }))
      })

      it('returns 400 if not given a proper TableCreation body', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/tables')
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send({a: 1})

        expect(res.status).toBe(400)
      })

      it('returns 401 if made anonymously', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/tables')
          .set({
            'Content-Type': 'application/vnd.api+json'
          })
          .send(createTableCreation(undefined, [user]))

        expect(res.status).toBe(401)
      })

      it('creates a new table', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/tables')
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send(createTableCreation(undefined, [user]))

        expect(res.status).toBe(200)
        expect(res.body.data.type).toBe('tables')
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.relationships.authors.data).toHaveLength(1)
        expect(res.body.data.relationships.authors.data[0].id).toBe(user.id)
      })
    })

    describe('GET', () => {
      it('returns a paginated list of tables', async () => {
        await setupTables(5)
        const res = await supertest(getSupertestRoot())
          .get(`/tables?limit=2&offset=1`)

        expect(res.status).toBe(200)
        expect(res.body.data).toHaveLength(2)
        expect(res.body.data[0].attributes).toHaveProperty('slug', 'table-04')
        expect(res.body.data[1].attributes).toHaveProperty('slug', 'table-03')
      })
    })
  })

  describe('Resource [/tables/:tableId]', () => {
    beforeEach(async () => {
      ({ tables, user, jwt } = await setupTables(1))
      table = tables[0]
    })

    describe('GET', () => {
      it('returns 404 if no table has that ID or slug', async () => {
        const ids = [crypto.randomUUID(), 'nope']
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .get(`/tables/${id}`)

          expect(res.status).toBe(404)
        }
      })

      it('returns a table', async () => {
        const ids = [table.id, table.slug]
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .get(`/tables/${id}`)

          expect(res.status).toBe(200)
          expect(res.body.data.type).toBe('tables')
          expect(res.body.data.id).toBe(table.id)
          expect(res.body.data.attributes.name).toBe(table.name)
          expect(res.body.data.relationships.authors.data).toHaveLength(table.authors.length)
          expect(res.body.included[0].type).toBe('users')
          expect(res.body.included[0].id).toBe(user.id)
          expect(res.body.included[0].attributes.name).toBe(user.name)
        }
      })
    })
  })
})
