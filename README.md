# API Starter

[![Run Tests](https://github.com/jefgodesky/api-starter/actions/workflows/test.yml/badge.svg)](https://github.com/jefgodesky/api-starter/actions/workflows/test.yml?query=branch%3Amain)
[![License](https://badgen.net/github/license/jefgodesky/api-starter)](https://github.com/jefgodesky/api-starter/blob/master/LICENSE)

_A starting point for RESTful API projects that
takes care of setting up environments, development
patterns, users, and authentication in ways that make
it easy to change and write high quality,
reliable code._

**Table of Contents**

1. [Why this exists](#why-this-exists)
2. [Principles](#principles)
3. [Implementation Details](#implementation-details)
   1. [Authentication](#authentication)
   2. [Roles & Permissions](#roles--permissions)
   3. [Error Handling](#error-handling)
   4. [Docker Containers](#docker-containers)
   5. [Environment & Configuration](#environment--configuration)
   6. [Running Tests](#running-tests)
   7. [Deploying](#deploying)
4. [Getting Started](#getting-started)
5. [Contributing](#contributing)

## Why this exists

While “it depends” is almost always the _really_
correct answer in software development, I find
that 9 times out of 10,
[API-first development](https://www.postman.com/api-first/)
is the way to go (and when I _think_ I’m in
that 10th time, I haven’t thought about it hard
enough and it turns out that API-first is
_still_ the way to go). This means that, at
the start of most projects, I keep doing the
same thing over and over again: setting up
Docker, the database, the continuous deployment
pipeline, creating endpoints for users and
OAuth authorization and authentication and
**sweet Christmas I just want to get to my
project!**

That’s why I wrote this: to handle that once more and
never again. From now on, this is where my projects start.
It’s a head start with reasonable values for all the parts
I find myself doing over and over again, written in such a
way that it should be easy to change in those rare
projects where I want something different.

And if you’re looking for the same things that
_I’m_ looking for in a good API, then maybe
it’ll be a good starting point for _your_
project, too.

## Principles

Your first question is probably that one: _are_
you looking for the same things in an API?
Well, here’s what _I’m_ looking for:

* **[Test-driven development (TDD)](https://testdriven.io/test-driven-development/):**
  Getting started with test-driven development
  can be a pain. You have to get your testing
  environment set up properly, and it always
  helps to have some examples of how to
  actually design for testability and how to
  write some of those tests.
* **[RESTful architecture](https://restfulapi.net/):**
  Too often, “RESTful” is mistaken to mean
  delivering JSON over HTTPS. This starter
  API takes the six guiding principles of
  REST seriously (even [HATEOAS](https://restfulapi.net/hateoas/)).
  It implements [JSON:API v1.1](https://jsonapi.org/).
  It uses endpoints, methods, and response
  codes deliberately and thoughtfully.
* **[Built to change](https://youtu.be/l1Efy4RB_kw?si=_-6Z739GYnbqFcLC):**
  A whole bunch of tiny functions and classes
  makes code easy to change. When we make it
  easy to embrace change, we can
  [fundamentally shift what software development means](https://uxdesign.cc/embracing-change-with-system-driven-design-55668dc6c88e).
  That’s critical in _any_ software project,
  but it’s doubly true for a starter project
  like this one. This starter API leans into
  its middleware architecture to break things
  down into a collection of small, reusable
  utility functions and middlewares.

Of course, this is only a _starter_ API. On
each of these points, this project can only
provide a _good start_. It will only matter
to you if you continue these practices in your
own work. But if these are things that you
already value in your own work, then this can
provide a valuable head-start for your API.

## Implementation Details

This starter API is built with:

* 🦕 [Deno](https://deno.com/)
* 🐿️ [Oak](https://oakserver.org/)
* 🐘 [PostgreSQL](https://www.postgresql.org/)
* 🐋 [Docker](https://www.docker.com/)
* 🐻 [Swagger](https://swagger.io/)

### Authentication

This is the real heart of what the starter
API offers, and the main reason you’d bother
with it, as opposed to just starting your
own API from scratch. This starter assumes
that you _don’t_ want to get into the
business of keeping passwords around. This
is built with the assumption that a client
is going to handle the business of going
back and forth between an end user and an
OAuth 2.0 provider to get an access or ID
token (depending on the provider). This API
provides the following endpoints to handle
authentication:

#### `POST /auth/tokens`

You start by making a request to this
endpoint, passing the access or ID token
that you got from the provider (as `token`)
and a string identifying what provider it
came from (as `provider`). Right now, the
starter API supports Google, GitHub, and
Discord. If you’d like to add another, feel
free to [file an enhancement request](https://github.com/jefgodesky/api-starter/issues/new?labels=enhancement).

If the access or ID token checks out, this
endpoint looks for a matching account (e.g.,
a Google account with the matching Google ID).
If there isn’t one, it creates a new user,
creates a new account for the Google login
and attaches it to that new user, and creates
a new token. If one already exists, then it
just creates a new token for that user. It
sends that token back as a JWT that you can
use with Bearer authentication to other API
requests. This token remains valid for 10
minutes (this is configurable; you can make
it longer or shorter, but it’s generally not
advisable to make this last longer than
15 minutes).

You can also use this endpoint by sending it
your JWT (as `token`; no `provider` when you
use it this way) to get a new JWT. This works
for up to 7 days after your original OAuth
authorization. Like the token expiration,
this is configurable, so you can make it
longer or shorter, depending on your security
needs.

#### `POST /accounts`

`POST /auth/tokens` would be sufficient if you
were OK with one user account for your Google
login, a second for your GitHub login, and a
third for your Discord login, but it seems
likely that at least some of your users will
want to log in to the same account regardless
of which provider they use. At the very least,
there’s me, _I’m_ that user. That’s where
`POST /accounts` comes in.

This works a lot like `POST /auth/tokens` on
the surface: just like that endpoint, you’re
sending it a `provider` and a `token`. Unlike
that endpoint, you have to also send your JWT
to this request as Bearer authentication.
It still validates the token with the
provider. If it checks out, rather than
making a new user, it makes a new account and
attaches it to _your_ account. That means
that the next time you use `POST /auth/tokens`,
you can pass an OAuth access token from that
provider and it will connect it to the
account you registered and send back a JWT
for your existing user account.

#### `DELETE /accounts/{provider}`

This endpoint allows an authenticated user to
remove an OAuth provider account from her
user account. Yes, a user could succeed in
completely locking herself out of her user
account this way. We recommend clients use
the `GET /accounts` endpoint to check which
accounts a user has and either warn the user
before she accidentally locks herself out or
disallows that behavior entirely.

### Roles & Permissions

In the `/roles` directory, you’ll find a
`README.md` file explaining the permissions
that are used in the starter API. I wrote
this with future extensibility in mind, so I
think continuing this pattern through the
rest of your API would be a good idea!

In the same directory is `roles.yml`,
which define the user roles and what
permissions they have. This starts off with
the roles that _I_ generally use in _my_
projects, but it should be easy enough to
define new roles as needed this way.

The `default` setting in `roles.yml` lists
which roles are given to users when they are
created. The `roles` setting defines the roles
in the system.

| Role        | Notes                                                                                                                                                                                        |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `anonymous` | This is the role that’s effectively applied to unauthenticated users. Use this to define the permissions that everyone has.                                                                  |
| `active`    | Users need this role in order to authenticate. You can lock problem users out of the system by revoking this role.                                                                           |
| `listed`    | This role is used to mark users who are included in public listings. Revoking this role would hide them. For example, `GET /users/{userId}` would come back 404 when requesting such a user. |
| `admin`     | This role gets the `*` permission, giving her the ability to do literally _anything_. This is the superuser role.                                                                            |

Permissions are applied using the
`requirePermissions` middleware, defined in
`middlewares/require/permissions.ts`. There,
you will find that it brings together several
permissions functions found in `utils/permissions/*.ts`
which check if given permissions are
satisfied. You can see some examples of the
`requirePermissions` middleware in use in
the users router in `collections/users/router.ts`.
`requirePermissions('user:update')` will
call the next middleware if the user making
the request has the `user:update` permission,
throw a 401 HTTP error if the request is
being made by an unauthenticated user, or
throw a 403 HTTP error if the request is
being made by an authenticated user who just
doesn’t have the permissions necessary.

If you pass multiple permissions to
`requirePermissions`, they are applied using
`AND` logic, meaning that a user only meets
the requirements if she meets _all_ of the
requirements specified.

### Error Handling

The `handleError` middleware (found in
`middlewares/handle-errors.ts`) catches
HTTP errors, packages them as error objects
that meet the JSON:API v1.1 specification,
and return them to the user. That means that
throughout your own middlewares, you can
throw errors using `createHttpError` from
`@oak/oak`. Take a look at the `requireClient`
middleware (found in `middlewares/require/client.ts`)
for an example of usage.

```typescript
import { Middleware, Status, createHttpError } from '@oak/oak'
import getMessage from '../../utils/get-message.ts'

const requireClient: Middleware = async (ctx, next) => {
  if (!ctx.state.client) throw createHttpError(Status.Unauthorized, getMessage('authentication_required'))
  await next()
}

export default requireClient
```

`getMessages` is a utility method that
handles microcopy like error messages
(kept in `messages.yml`), which should make
internationalization a bit easier if you ever
have to deal with that.

### Docker Containers

The API is set up with Docker in mind.
You’ll find two Docker Compose configuration
files: `dev.yml` (for the development
environment) and `test.yml` (for the testing
environment).

In the development environment, your
containers are:

| Container  | Notes                                                        |
|------------|--------------------------------------------------------------|
| `postgres` | The PostgreSQL container. This container runs your database. |
| `api`      | The container that actually runs your API.                   |

You can spin up the development environment by running:

```shell
deno run start
```

And spin it down by running:

```shell
deno run stop
```

The data in your database is kept in a
volume called `NETWORK_dev_db`, so as long
as that volume is maintained, your data will
persist.

The test environment adds one more container:

| Container | Notes                                                                           |
|-----------|---------------------------------------------------------------------------------|
| `tests`   | This container waits for the API to become available, and then runs your tests. |

### Environment & Configuration

Both environments have two `.env` files
associated with them: `.api.env`, which is
passed to the `api` container, and
`.postgres.env`, which is passed to both the
`api` and the `postgres` containers. These
files allow you to configure a great deal about
your API. We recommend that you continue this
pattern by adding your own configuration
options here as well.

| File            | Variable             | Notes                                                                                                                                                                                                                                      |
|-----------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `.postgres.env` | `POSTGRES_PASSWORD`  | The password for your PostgreSQL database. The container will create a database with this password.                                                                                                                                        |
| `.postgres.env` | `POSTGRES_USER`      | The username for your PostgreSQL database. The container will create a user with this username and a database with the same name.                                                                                                          |   |
| `.postgres.env` | `POSTGRES_DB`        | The name of your PostgreSQL database. The container won’t automatically create this (unless it’s identical to `POSTGRES_USER`), so if you want a database with a different name, you’ll have some extra configuration work to do.          |
| `.postgres.env` | `POSTGRES_HOST`      | The host of your PostgreSQL server. This should match the name of your container.                                                                                                                                                          |
| `.postgres.env` | `POSTGRES_PORT`      | The port that the PostgreSQL server is listening on.                                                                                                                                                                                       |
| `.postgres.env` | `POSTGRES_POOLS`     | The number of pools that the PostgreSQL database will allow at any given time.                                                                                                                                                             |
| `.postgres.env` | `TOKEN_EXPIRATION`   | An expression of how long a token (JWT) should be valid for. The default is `10 minutes`. You could be introducing security concerns if you make this much higher than 15 minutes.                                                         |
| `.postgres.env` | `REFRESH_EXPIRATION` | An expression of how long after the original OAuth authorization a user should be allowed to refresh an old token. The default is `7 days`.                                                                                                |
| `.api.env`      | `API_VERSION`        | The version of the API. Changing this will change every endpoint.                                                                                                                                                                          |
| `.api.env`      | `API_DOMAIN`         | The domain that the API is hosted on.                                                                                                                                                                                                      |
| `.api.env`      | `API_PROTOCOL`       | This can be `http` or `https`. For development, this is set to `http`, but any API in development _should_ be set to `https`.                                                                                                              |
| `.api.env`      | `PORT`               | The port that the API is listening for requests on.                                                                                                                                                                                        |
| `.api.env`      | `IS_TEST`            | Set to `true` in the testing environment.                                                                                                                                                                                                  |
| `.api.env`      | `JWT_SECRET`         | The secret used to sign and verify your JWTs. If this leaks, your API’s security is compromised. Keep it secret, keep it safe. This is probably the biggest reason why you should ***NEVER*** commit your `.env` files to your repository! |
| `.api.env`      | `MAX_PAGE_SIZE`      | The maximum number of items that can appear on a single page (in paginated results).                                                                                                                                                       |
| `.api.env`      | `DEFAULT_PAGE_SIZE`  | The number of items that appears on a single page if the request doesn’t specify (in paginated results).                                                                                                                                   |
| `.api.env`      | `LANG`               | The language from which microcopy (e.g., error messages) are pulled.                                                                                                                                                                       |

### Running Tests

To run your tests, run:

```shell
deno run test
```

This spins up the testing environment, runs
your tests, prints out the results, then
spins down the testing environment.

Integration tests use [SuperTest](https://www.npmjs.com/package/supertest)
to make requests from the API. This is why
the testing environment is set up the way
that it is. It also means that if there’s a
problem, it _might_ be something that’s only
visible from _within the API_, meaning that
errors being thrown or information being
logged to the console are showing up in the
`api` container, not the `tests` container.
When that happens, you’ll see the tests
failing, but the critical information about
_why_ will only show up in the logs from the
`api` container. Most of the time, `./test.sh`
cleaning up after itself is a great
convenience, but in specific situations like
this it requires you to get a little deeper
under the hood. When this happens you can
run:

```shell
docker compose -f test.yml up --build -d
```

This will run the tests, but the testing
environment will remain up afterwards,
including the `api` container, so you can
check its logs or conduct other experiments
to see what went wrong. When you’re done,
you’ll have to spin the test environment
down manually by running:

```shell
docker compose -f test.yml down
```

### Deploying

To deploy your API, you’ll want to create the following
files:

* `prod.yml`
* `prod.postgres.env`
* `prov.api.env`

The `dev` version of each of these files is a good
starting point, but make sure that you replace them
with production-ready configuration options.

I usually host my projects on [DigitalOcean](https://www.digitalocean.com/),
so the starter comes with a GitHub Actions workflow
in `.github/workflows/release.yml` which fire when I
make a new release and deploys the project to a
DigitalOcean droplet defined in my repository secrets.
If you also use DigitalOcean, this should work out
pretty well for you, too. If not, it might be a starting
point that you can amend to match your own production
deployment needs.

## Getting Started

If this sounds like something that could be useful to
you, that’s great! Click the green **Use this template**
button above to create your own copy of this repository.

* You’ll want to update a lot of the header information
in `docs/index.yml` to describe _your_ project, rather
than a generic starter API.
* In each of the Docker Compose configuration files (found
in `env/*.yml`), you may want to update the name to
reflect your project (e.g., `api_starter_dev` to
`my_project_dev`).

If you’re looking for a step-by-step example of how to
get started using this to handle CRUD operations, check
out the [To Do API example](https://github.com/jefgodesky/api-starter-todo)
and [the accompanying tutorial](https://medium.com/@jason.godesky/jumpstarting-a-new-restful-api-ef4cc553e809).

## Contributing

There’s a number of ways to contribute to this project.
The simplest is to just [file an issue](https://github.com/jefgodesky/api-starter/issues),
whether that’s a bug you found, an improvement you
think I could make, or an enhancement you’d like to see.

If you’d like to fork this for your own projects, you
have my blessing. That’s kind of the whole point of
releasing it as a template, but even if you want to
fork this to make your own, rival template, by all
means, have at it. Maybe I’ll use _your_ starter for
my next project _instead_ of this.

But if you’d like to contribute directly to this code,
[pull requests](https://github.com/jefgodesky/api-starter/compare)
are always welcome.