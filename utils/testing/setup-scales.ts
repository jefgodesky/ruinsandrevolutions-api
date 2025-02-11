import type Scale from '../../types/scale.ts'
import type User from '../../types/user.ts'
import ScaleRepository from '../../collections/scales/repository.ts'
import setupUser from './setup-user.ts'
import { createScaleCreation } from '../../types/scale-creation.ts'

const setupScales = async (n: number, names: string[] = []): Promise<{ user: User, jwt: string, scales: Scale[] }> => {
  const { user, jwt } = await setupUser({ createAccount: false })
  const counterLength = n.toString().length + 1
  const repository = new ScaleRepository()
  const scales: Scale[] = []

  for (let i = names.length; i < n; i++) {
    names.push('Test Scale')
  }

  for (const [index, name] of names.entries()) {
    const slug = `scale-${(index + 1).toString().padStart(counterLength, '0')}`
    const scale = await repository.create(createScaleCreation({ slug, name }, [user]))
    if (scale !== null) scales.push(scale)
  }

  return { user, jwt: jwt!, scales }
}

export default setupScales
