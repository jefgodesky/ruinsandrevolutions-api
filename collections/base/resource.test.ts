import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type { Router } from '@oak/oak'
import UserRouter from '../users/router.ts'
import getRoot from '../../utils/get-root.ts'
import { getEndpoints } from './resource.ts'

describe('RootResource methods', () => {
  const routers: Record<string, Router> = { users: UserRouter }

  describe('getEndpoints', () => {
    it('creates a link object with endpoints', () => {
      const expected = {
        self: getRoot(),
        describedBy: `${getRoot()}/docs`,
        users: `${getRoot()}/users`
      }
      expect(getEndpoints(routers)).toEqual(expected)
    })
  })
})
