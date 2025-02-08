import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import DB from '../../../DB.ts'
import getSupertestRoot from '../../../utils/testing/get-supertest-root.ts'

describe('/auth/tokens', () => {
  afterEach(DB.clear)
  afterAll(DB.close)

  describe('Collection [/auth/tokens]', () => {
    describe('POST', () => {
      it('returns 400 if given a bad token', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/auth/tokens')
          .set({'Content-Type': 'application/vnd.api+json'})
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
  })
})
