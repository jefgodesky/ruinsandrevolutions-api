import type Account from '../../../types/account.ts'
import type ProviderID from '../../../types/provider-id.ts'
import type User from '../../../types/user.ts'

const userProviderIdToAccount = (user: User, pid: ProviderID): Account => {
  return {
    uid: user.id ?? '',
    provider: pid.provider,
    pid: pid.pid
  }
}

export default userProviderIdToAccount
