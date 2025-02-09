import Scale from '../../types/scale.ts'
import { createScaleCreation } from '../../types/scale-creation.ts'
import type User from '../../types/user.ts'
import ScaleRepository from '../../collections/scales/repository.ts'
import setupUser from './setup-user.ts'

const setupScales = async (n: number): Promise<{ user: User, jwt: string, scales: Scale[] }> => {
  const { user, jwt } = await setupUser({ createAccount: false })
  const counterLength = n.toString().length + 1
  const repository = new ScaleRepository()
  const scales: Scale[] = []

  for (let i = 1; i <= n; i++) {
    const slug = `scale-${i.toString().padStart(counterLength, '0')}`
    const post = createScaleCreation({ slug }, [user])
    const scale = await repository.create(post)
    if (scale !== null) scales.push(scale)
  }

  return { user, jwt: jwt!, scales }
}

export default setupScales
