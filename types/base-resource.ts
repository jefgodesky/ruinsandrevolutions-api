import Links from './links.ts'

export default interface BaseResource {
  type: string
  id: string
  links?: Links
}
