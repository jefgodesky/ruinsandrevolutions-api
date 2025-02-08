import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import DB from '../../../DB.ts'
import getRoot from '../../../utils/get-root.ts'
import getSupertestRoot from '../../../utils/testing/get-supertest-root.ts'
import ProviderResource from '../../../types/provider-resource.ts'

describe('/auth/providers', () => {
  afterEach(DB.clear)
  afterAll(DB.close)

  describe('Collection [/auth/providers]', () => {
    describe('GET', () => {
      it('returns a list of supported OAuth 2.0 providers', async () => {
        const res = await supertest(getSupertestRoot())
          .get('/auth/providers')

        const { links, data } = res.body
        const providers = data.map((provider: ProviderResource) => provider.id)
        expect(res.status).toBe(200)
        expect(links.self).toBe(`${getRoot()}/auth/providers`)
        expect(links.describedBy).toBe(`${getRoot()}/docs`)
        expect(data).toHaveLength(3)
        expect(providers).toContain('google')
        expect(providers).toContain('github')
        expect(providers).toContain('discord')
      })
    })
  })
})
