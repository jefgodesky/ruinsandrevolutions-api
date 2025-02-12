import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import type Scroll from '../../types/scroll.ts'
import type ScrollAttributes from '../../types/scroll-attributes.ts'
import type ScrollPatch from '../../types/scroll-patch.ts'
import type User from '../../types/user.ts'
import type UserResource from '../../types/user-resource.ts'
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

    describe('PATCH', () => {
      let patch: ScrollPatch
      const updatedName = 'Updated Scroll'
      const updatedStart = {
        human: '5 - Intelligence',
        computable: '{{5 - Intelligence}}'
      }

      beforeEach(() => {
        patch = {
          data: {
            type: 'scrolls',
            id: scroll.id ?? 'ERROR',
            attributes: {
              name: updatedName,
              start: updatedStart
            }
          }
        }
      })

      it('returns 400 if not given a valid ScrollPatch', async () => {
        const ids = [scroll.id, scroll.slug]
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .patch(`/scrolls/${id}`)
            .set({
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/vnd.api+json'
            })
            .send({ a: 1 })

          expect(res.status).toBe(400)
        }
      })

      it('returns 401 if not authenticated', async () => {
        const ids = [scroll.id, scroll.slug]
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .patch(`/scrolls/${id}`)
            .set({
              'Content-Type': 'application/vnd.api+json'
            })
            .send(patch)

          expect(res.status).toBe(401)
        }
      })

      it('returns 403 if authenticated without permission', async () => {
        const { jwt } = await setupUser({ createAccount: false })
        const ids = [scroll.id, scroll.slug]
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .patch(`/scrolls/${id}`)
            .set({
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/vnd.api+json'
            })
            .send(patch)

          expect(res.status).toBe(403)
        }
      })

      it('returns 404 if no scale has that ID or slug', async () => {
        const ids = [crypto.randomUUID(), 'nope']
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .patch(`/scrolls/${id}`)
            .set({
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/vnd.api+json'
            })
            .send(patch)

          expect(res.status).toBe(404)
        }
      })

      it('patches a scroll', async () => {
        const ids = [scroll.id, scroll.slug]
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .patch(`/scrolls/${id}`)
            .set({
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/vnd.api+json'
            })
            .send(patch)

          const untouchedFields = ['slug', 'description', 'body', 'attribution'] as (keyof ScrollAttributes)[]

          expect(res.status).toBe(200)
          expect(res.body.data.type).toBe('scrolls')
          expect(res.body.data.id).toBe(scroll.id)
          expect(res.body.data.attributes.name).toBe(updatedName)
          expect(res.body.data.attributes.start).toEqual(updatedStart)
          for (const field of untouchedFields) {
            expect(res.body.data.attributes[field]).toBe(scroll[field])
          }
        }
      })

      it('adds authors', async () => {
        const { user } = await setupUser({ createAccount: false, createToken: false })
        const res = await supertest(getSupertestRoot())
          .patch(`/scrolls/${scroll.id}`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send({
            data: {
              type: 'scrolls',
              id: scroll.id ?? 'ERROR',
              attributes: {},
              relationships: {
                authors: {
                  data: [
                    ...scroll.authors.map(author => ({ type: 'users', id: author.id ?? 'ERROR' } as UserResource)),
                    { type: 'users', id: user.id } as UserResource
                  ]
                }
              }
            }
          })

        expect(res.body.data.relationships.authors.data).toHaveLength(2)
        expect(res.body.included).toHaveLength(2)
      })

      it('removes authors', async () => {
        const res = await supertest(getSupertestRoot())
          .patch(`/scrolls/${scroll.id}`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send({
            data: {
              type: 'scrolls',
              id: scroll.id ?? 'ERROR',
              attributes: {},
              relationships: {authors: {data: []}}
            }
          })

        expect(res.body.data.relationships.authors.data).toHaveLength(0)
        expect(res.body.included).toHaveLength(0)
      })
    })

    describe('DELETE', () => {
      it('returns 401 if not authenticated', async () => {
        const res = await supertest(getSupertestRoot())
          .delete(`/scrolls/${scroll.id}`)
          .set({
            'Content-Type': 'application/vnd.api+json'
          })

        expect(res.status).toBe(401)
      })

      it('returns 403 if authenticated without permission', async () => {
        const { jwt } = await setupUser({ createAccount: false })
        const res = await supertest(getSupertestRoot())
          .delete(`/scrolls/${scroll.id}`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })

        expect(res.status).toBe(403)
      })

      it('returns 404 if no scroll has that slug', async () => {
        const res = await supertest(getSupertestRoot())
          .delete(`/scrolls/nope`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })

        expect(res.status).toBe(404)
      })

      it('deletes a scroll', async () => {
        const res = await supertest(getSupertestRoot())
          .delete(`/scrolls/${scroll.id}`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })

        const check = await supertest(getSupertestRoot())
          .get(`/scrolls/${scroll.id}`)

        expect(res.status).toBe(204)
        expect(check.status).toBe(404)
      })
    })
  })
})
