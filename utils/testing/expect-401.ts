import { expect } from 'jsr:@std/expect'
import { type Spy } from '@std/testing/mock'
import { HttpError, Status } from '@oak/oak'
import getMessage from '../get-message.ts'

const expect401 = (err: Error, next: Spy<unknown, [], Promise<void>>) => {
  expect((err as HttpError).message).toBe(getMessage('authentication_required'))
  expect((err as HttpError).status).toBe(Status.Unauthorized)
  expect(next.calls).toHaveLength(0)
}

export default expect401
