import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import type Scale from '../../types/scale.ts'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'
import { createScaleCreation } from '../../types/scale-creation.ts'
import getSupertestRoot from '../../utils/testing/get-supertest-root.ts'
import setupScales from '../../utils/testing/setup-scales.ts'
import setupUser from '../../utils/testing/setup-user.ts'

describe('/scales', () => {
  let scales: Scale[]
  let scale: Scale
  let user: User
  let jwt: string | undefined

  afterEach(DB.clear)
  afterAll(DB.close)

  describe('Collection [/scales]', () => {
    describe('POST', () => {
      beforeEach(async () => {
        ({ user, jwt } = await setupUser({ createAccount: false }))
      })

      it('returns 400 if not given a proper ScaleCreation body', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/scales')
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send({ a: 1 })

        expect(res.status).toBe(400)
      })

      it('returns 401 if made anonymously', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/scales')
          .set({
            'Content-Type': 'application/vnd.api+json'
          })
          .send(createScaleCreation(undefined, [user]))

        expect(res.status).toBe(401)
      })

      it('creates a new scale', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/scales')
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
          .send(createScaleCreation(undefined, [user]))

        expect(res.status).toBe(200)
        expect(res.body.data.type).toBe('scales')
        expect(res.body.data.id).toBeDefined()
        expect(res.body.data.relationships.authors.data).toHaveLength(1)
        expect(res.body.data.relationships.authors.data[0].id).toBe(user.id)
      })
    })

    describe('GET', () => {
      it('returns a paginated list of scales', async () => {
        await setupScales(5)
        const res = await supertest(getSupertestRoot())
          .get(`/scales?limit=2&offset=1`)

        expect(res.status).toBe(200)
        expect(res.body.data).toHaveLength(2)
        expect(res.body.data[0].attributes).toHaveProperty('slug', 'scale-04')
        expect(res.body.data[1].attributes).toHaveProperty('slug', 'scale-03')
      })
    })
  })

  describe('Resource [/scales/:scaleId]', () => {
    beforeEach(async () => {
      ({ scales, user, jwt } = await setupScales(1))
      scale = scales[0]
    })

    describe('GET', () => {
      it('returns 404 if no scale has that ID or slug', async () => {
        const ids = [crypto.randomUUID(), 'nope']
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .get(`/scales/${id}`)

          expect(res.status).toBe(404)
        }
      })

      it('returns a scale', async () => {
        const ids = [scale.id, scale.slug]
        for (const id of ids) {
          const res = await supertest(getSupertestRoot())
            .get(`/scales/${id}`)

          expect(res.status).toBe(200)
          expect(res.body.data.type).toBe('scales')
          expect(res.body.data.id).toBe(scale.id)
          expect(res.body.data.attributes.name).toBe(scale.name)
          expect(res.body.data.relationships.authors.data).toHaveLength(scale.authors.length)
          expect(res.body.included[0].type).toBe('users')
          expect(res.body.included[0].id).toBe(user.id)
          expect(res.body.included[0].attributes.name).toBe(user.name)
        }
      })
    })
  })
})
