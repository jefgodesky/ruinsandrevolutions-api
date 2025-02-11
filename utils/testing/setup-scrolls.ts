import type Scroll from '../../types/scroll.ts'
import type User from '../../types/user.ts'
import ScrollRepository from '../../collections/scrolls/repository.ts'
import setupUser from './setup-user.ts'
import { createScrollCreation } from '../../types/scroll-creation.ts'

const setupScrolls = async (n: number, names: string[] = []): Promise<{ user: User, jwt: string, scrolls: Scroll[] }> => {
  const { user, jwt } = await setupUser({ createAccount: false })
  const counterLength = n.toString().length + 1
  const repository = new ScrollRepository()
  const scrolls: Scroll[] = []

  for (let i = names.length; i < n; i++) {
    names.push('Test Scroll')
  }

  for (const [index, name] of names.entries()) {
    const slug = `scroll-${(index + 1).toString().padStart(counterLength, '0')}`
    const scale = await repository.create(createScrollCreation({ slug, name }, [user]))
    if (scale !== null) scrolls.push(scale)
  }

  return { user, jwt: jwt!, scrolls }
}

export default setupScrolls
