import isObject from './object.ts'

const isObjectArray = (value: unknown): value is object[] => {
  return Array.isArray(value) && value.every(item => isObject(item))
}

export default isObjectArray
