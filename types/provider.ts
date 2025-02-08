export const PROVIDERS = {
  GOOGLE: 'google',
  DISCORD: 'discord',
  GITHUB: 'github'
} as const

type Provider = typeof PROVIDERS[keyof typeof PROVIDERS]

const isProvider = (candidate: unknown): candidate is Provider => {
  if (typeof candidate !== 'string') return false
  return (Object.values(PROVIDERS) as Provider[]).includes(candidate as Provider)
}

export default Provider
export { isProvider }
