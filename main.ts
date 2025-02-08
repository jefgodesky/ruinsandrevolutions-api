import api from './api.ts'
import getEnvNumber from './utils/get-env-number.ts'

const port = getEnvNumber('PORT', 80)
await api.listen({ port })
