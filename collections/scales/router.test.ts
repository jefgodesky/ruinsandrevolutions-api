import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import type Scale from '../../types/scale.ts'
import type User from '../../types/user.ts'
import DB from '../../DB.ts'
import { createScaleCreation } from '../../types/scale-creation.ts'
import getSupertestRoot from '../../utils/testing/get-supertest-root.ts'
import setupUser from '../../utils/testing/setup-user.ts'

describe('/scales', () => {
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
  })
})
