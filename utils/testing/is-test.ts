const isTest = (): boolean => {
  const env = Deno.env.get('IS_TEST')
  return env === 'true'
}

export default isTest
