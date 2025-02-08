import { describe, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import getSupertestRoot from './utils/testing/get-supertest-root.ts'
import getMessage from './utils/get-message.ts'

describe('API', () => {
  it('returns 404 for an endpoint that does not exist', async () => {
    const res = await supertest(getSupertestRoot())
      .get('/this-is-not-the-endpoint-you-are-looking-for')

    expect(res.status).toBe(404)
    expect(res.body.errors).toHaveLength(1)
    expect(res.body.errors[0].status).toBe('404')
    expect(res.body.errors[0].detail).toBe(getMessage('endpoint_not_found'))
  })
})
