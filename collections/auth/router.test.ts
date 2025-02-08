import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import DB from '../../DB.ts'
import getRoot from '../../utils/get-root.ts'
import getSupertestRoot from '../../utils/testing/get-supertest-root.ts'

describe('/auth', () => {
  afterEach(DB.clear)
  afterAll(DB.close)

  describe('Collection [/auth]', () => {
    describe('GET', () => {
      it('returns a directory of available endpoints', async () => {
        const res = await supertest(getSupertestRoot())
          .get('/auth')

        expect(res.status).toBe(200)
        expect(res.body.links.self).toBe(getRoot() + '/auth')
        expect(res.body.links.describedBy).toBe(getRoot() + '/docs')
        expect(res.body.links.tokens).toBe(getRoot() + '/auth/tokens')
      })
    })
  })
})
