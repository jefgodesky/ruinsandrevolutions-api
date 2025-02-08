import { isUser } from '../../types/user.ts'

const isUserArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every(item => isUser(item))
}

export default isUserArray
