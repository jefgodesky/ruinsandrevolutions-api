import { Middleware } from '@oak/oak'
import type UserResource from '../../types/user-resource.ts'
import UserRepository from '../../collections/users/repository.ts'

const loadBackupAuthor: Middleware = async (ctx, next) => {
  if (ctx.state.itemCreation && ctx.state.client) {
    if (!ctx.state.itemCreation.data.relationships) ctx.state.itemCreation.data.relationships = {}
    if (!ctx.state.itemCreation.data.relationships.authors) ctx.state.itemCreation.data.relationships.authors = { data: [] }

    const users = new UserRepository()
    const given = ctx.state.itemCreation.data.relationships.authors.data as UserResource[]
    const verified = await users.filterUserIDs(given.map(author => author.id))

    if (verified.length < 1) {
      const { id } = ctx.state.client
      verified.push(id)
      ctx.state.itemCreation.data.relationships.authors.data.push({ type: 'users', id })
    }

    ctx.state.itemCreation.data.relationships.authors.data = given
      .filter(author => verified.includes(author.id))
  }

  await next()
}

export default loadBackupAuthor
