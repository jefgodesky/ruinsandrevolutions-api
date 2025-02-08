// deno-lint-ignore no-explicit-any
const isObject = (candidate: any): candidate is object => {
  return typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate)
}

export default isObject
