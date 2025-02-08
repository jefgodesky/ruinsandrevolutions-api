import BaseResource from '../types/base-resource.ts'

const removeDuplicateResources = <T extends BaseResource>(arr: T[]): T[] => {
  const map = new Map<string, T>()

  arr.forEach(item => {
    const key = `${item.type} ${item.id}`
    if (!map.has(key)) map.set(key, item)
  })

  return Array.from(map.values())
}

export default removeDuplicateResources
