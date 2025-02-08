const getJWTSecret = (): string => Deno.env.get('JWT_SECRET') ?? ''
export default getJWTSecret
