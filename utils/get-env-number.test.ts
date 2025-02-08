import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import getEnvNumber from './get-env-number.ts'

describe('getEnvNumber', () => {
  it('returns the environment variable value as a number', () => {
    const actual = getEnvNumber('MAX_PAGE_SIZE')
    expect(typeof actual).toEqual('number')
  })

  it('defaults to zero if not found', () => {
    const actual = getEnvNumber('ENV_VAR_DOES_NOT_EXIST')
    expect(actual).toEqual(0)
  })

  it('defaults to specified fallback if not found', () => {
    const fallback = 42
    const actual = getEnvNumber('ENV_VAR_DOES_NOT_EXIST', fallback)
    expect(actual).toEqual(fallback)
  })
})
