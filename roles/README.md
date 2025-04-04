# Permissions

## Scales

### `scale:create`

With this, a user has permission to create a new scale.

### `scale:read`

With this, a user has permission to view any scale.

### `scale:update`

With this, a user has permission to update any scale.

### `scale:delete`

With this, a user has permission to delete any scale.

### `scale:author:read`

With this, a user has permission to view any scale that she is
an author of. Note that a user who has `scale:read` can also view
scales that she has authored, even if she does not have
`scale:author:read`. This is  only meaningful for users who do
not have `scale:read`.

### `scale:author:update`

With this, a user has permission to make changes to any scale that
she is an author of. Note that a user who has `scale:update` can
also make changes to scales that she has authored, even if she does
not have `scale:author:update`. This is  only meaningful for users
who do not have `scale:update`.

### `scale:author:delete`

With this, a user has permission to delete any scale that
she is an author of. Note that a user who has `scale:delete` can
also delete scales that she has authored, even if she does
not have `scale:author:delete`. This is  only meaningful for users
who do not have `scale:delete`.

## Scrolls

### `scroll:create`

With this, a user has permission to create a new scroll.

### `scroll:read`

With this, a user has permission to view any scroll.

### `scroll:update`

With this, a user has permission to update any scroll.

### `scale:delete`

With this, a user has permission to delete any scroll.

### `scroll:author:read`

With this, a user has permission to view any scroll that she is
an author of. Note that a user who has `scroll:read` can also view
scrolls that she has authored, even if she does not have
`scroll:author:read`. This is  only meaningful for users who do
not have `scroll:read`.

### `scroll:author:update`

With this, a user has permission to make changes to any scroll that
she is an author of. Note that a user who has `scroll:update` can
also make changes to scrolls that she has authored, even if she does
not have `scroll:author:update`. This is  only meaningful for users
who do not have `scroll:update`.

### `scroll:author:delete`

With this, a user has permission to delete any scroll that
she is an author of. Note that a user who has `scroll:delete` can
also delete scrolls that she has authored, even if she does
not have `scroll:author:delete`. This is  only meaningful for users
who do not have `scroll:delete`.

## Tables

### `table:create`

With this, a user has permission to create a new random table.

### `table:read`

With this, a user has permission to view any table.

### `table:update`

With this, a user has permission to update any table.

### `table:delete`

With this, a user has permission to delete any table.

### `table:author:read`

With this, a user has permission to view any table that she is
an author of. Note that a user who has `table:read` can also view
tables that she has authored, even if she does not have
`table:author:read`. This is  only meaningful for users who do
not have `table:read`.

### `table:author:update`

With this, a user has permission to make changes to any table that
she is an author of. Note that a user who has `table:update` can
also make changes to tables that she has authored, even if she does
not have `table:author:update`. This is  only meaningful for users
who do not have `table:update`.

### `table:author:delete`

With this, a user has permission to delete any table that
she is an author of. Note that a user who has `table:delete` can
also delete tables that she has authored, even if she does
not have `table:author:delete`. This is  only meaningful for users
who do not have `table:delete`.

## Users

### `user:read`

With this, a user has permission to view any user record.

### `user:update`

With this, a user has permission to edit any user record.

### `user:destroy`

With this, a user has permission to delete any user record.
This deletes any accounts or tokens associated with that
user record as well.

### `user:self:read`

With this, a user has permission to view her own user record.
Note that a user who has `user:read` can also view her own user
record, even if she does not have `user:self:read`. This is
only meaningful for users who do not have `user:read`.

### `user:self:update`

With this, a user has permission to make changes to her own
user record. Note that a user who has `user:write` can also
make changes to her own user record, even if she does not
have `user:self:write`. This is only meaningful for users who
do not have `user:write`.

### `user:self:destroy`

With this, a user has permission to delete her own user
record. Note that a user who has `user:delete` can also delete
her own user record, even if she does not have
`user:self:delete`. This is only meaningful for users who do
not have `user:delete`.

## Roles

### `role:x:grant`

For each role _x_, this gives the user the permission
to grant that role to herself or others. For example,
`role:admin:grant` gives the user the ability to grant the role
of `admin` to any user, including herself.

### `role:x:revoke`

For each role _x_, this gives the user the permission
to revoke that role from herself or others. For example,
`role:admin:revoke` gives the user the ability to revoke
the role of `admin` from any user, including herself.

### `role:self:x:grant`

For each role _x_, this gives the user the permission
to grant that role to herself. For example,
`role:self:admin:grant` gives the user the ability to
grant the role of `admin` to herself. Note that a user
who has `role:x:grant` can also grant the role to
herself, even if she does not have `role:self:x:grant`.
This is only meaningful for users who do not have
`role:x:grant`.

### `role:self:x:revoke`

For each role _x_, this gives the user the permission
to revoke that role from herself. For example,
`role:self:admin:revoke` gives the user the ability to
revoke the role of `admin` from herself. Note that a user
who has `role:x:revoke` can also revoke the role from
herself, even if she does not have `role:self:x:revoke`.
This is only meaningful for users who do not have
`role:x:revoke`.