import type Table from '../../types/table.ts'
import type User from '../../types/user.ts'
import TableRepository from '../../collections/tables/repository.ts'
import setupUser from './setup-user.ts'
import { createTableCreation } from '../../types/table-creation.ts'

const setupTables = async (n: number, names: string[] = []): Promise<{ user: User, jwt: string, tables: Table[] }> => {
  const { user, jwt } = await setupUser({ createAccount: false })
  const counterLength = n.toString().length + 1
  const repository = new TableRepository()
  const tables: Table[] = []

  for (let i = names.length; i < n; i++) {
    names.push('Test Table')
  }

  for (const [index, name] of names.entries()) {
    const slug = `table-${(index + 1).toString().padStart(counterLength, '0')}`
    const table = await repository.create(createTableCreation({ slug, name }, [user]))
    if (table !== null) tables.push(table)
  }

  return { user, jwt: jwt!, tables }
}

export default setupTables
