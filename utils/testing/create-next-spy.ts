import { spy, type Spy } from '@std/testing/mock'

const createNextSpy = (): Spy<unknown, [], Promise<void>> => {
  return spy(() => new Promise<void>(resolve => { resolve() }))
}

export default createNextSpy
