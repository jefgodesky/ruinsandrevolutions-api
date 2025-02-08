export interface RelationshipData {
  type: string
  id: string
}

export default interface Relationship {
  links: {
    self: string
  },
  data: RelationshipData | RelationshipData[]
}
