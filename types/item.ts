import type User from './user.ts'

export default interface Item {
  id?: string
  authors: User[]
}
