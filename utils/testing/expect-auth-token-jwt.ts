import { expect } from 'jsr:@std/expect'
import { type JWTPayload } from '@cross/jwt'
import User from '../../types/user.ts'

const expectAuthTokenJWT = (payload: JWTPayload, user: User) => {
  expect(payload.sub).toBe(user.id)
  expect(payload.user.id).toBe(user.id)
  expect(payload.user.name).toBe(user.name)
  expect(payload.refresh).toBeDefined()
  expect(payload.expiration.token).toBeDefined()
  expect(payload.expiration.refresh).toBeDefined()
}

export default expectAuthTokenJWT
