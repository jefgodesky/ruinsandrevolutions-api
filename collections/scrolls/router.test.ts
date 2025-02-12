import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import type Scroll from '../../types/scroll.ts'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'
import { createScrollCreation } from '../../types/scroll-creation.ts'
import getSupertestRoot from '../../utils/testing/get-supertest-root.ts'
import setupScrolls from '../../utils/testing/setup-scrolls.ts'
import setupUser from '../../utils/testing/setup-user.ts'

describe('/scrolls', () => {
  let scrolls: Scroll[]
  let scroll: Scroll
  let user: User
  let jwt: string | undefined

  afterEach(DB.clear)
  afterAll(DB.close)

  describe('Collection [/scrolls]', () => {
    describe('POST', () => {
      beforeEach(async () => {
        ({user, jwt} = await setupUser({ createAccount: false }))
      })

      it('returns 400 if not given a proper ScrollCreation body', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/scrolls')
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send({a: 1})

        expect(res.status).toBe(400)
      })

      it('returns 401 if made anonymously', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/scrolls')
          .set({
            'Content-Type': 'application/vnd.api+json'
          })
          .send(createScrollCreation(undefined, [user]))

        expect(res.status).toBe(401)
      })

      it('creates a new scale', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/scrolls')
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send(createScrollCreation(undefined, [user]))

        expect(res.status).toBe(200)
        expect(res.body.data.type).toBe('scrolls')
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.relationships.authors.data).toHaveLength(1)
        expect(res.body.data.relationships.authors.data[0].id).toBe(user.id)
      })
    })

    describe('GET', () => {
      it('returns a paginated list of scrolls', async () => {
        await setupScrolls(5)
        const res = await supertest(getSupertestRoot())
          .get(`/scrolls?limit=2&offset=1`)

        expect(res.status).toBe(200)
        expect(res.body.data).toHaveLength(2)
        expect(res.body.data[0].attributes).toHaveProperty('slug', 'scroll-04')
        expect(res.body.data[1].attributes).toHaveProperty('slug', 'scroll-03')
      })
    })
  })

  describe('Resource [/scrolls/:scrollId]', () => {
    beforeEach(async () => {
      ({ scrolls, user, jwt } = await setupScrolls(1))
      scroll = scrolls[0]
    })

    describe('GET', () => {
      it('returns 404 if no scroll has that ID or slug', async () => {
        const ids = [crypto.randomUUID(), 'nope']
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .get(`/scrolls/${id}`)

          expect(res.status).toBe(404)
        }
      })

      it('returns a scroll', async () => {
        const ids = [scroll.id, scroll.slug]
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .get(`/scrolls/${id}`)

          expect(res.status).toBe(200)
          expect(res.body.data.type).toBe('scrolls')
          expect(res.body.data.id).toBe(scroll.id)
          expect(res.body.data.attributes.name).toBe(scroll.name)
          expect(res.body.data.relationships.authors.data).toHaveLength(scroll.authors.length)
          expect(res.body.included[0].type).toBe('users')
          expect(res.body.included[0].id).toBe(user.id)
          expect(res.body.included[0].attributes.name).toBe(user.name)
        }
      })
    })
  })
})
