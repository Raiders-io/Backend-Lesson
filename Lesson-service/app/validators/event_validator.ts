import vine from '@vinejs/vine'

/**
 * Payload of the `username.updated` event.
 *
 * Published when a user modified his username
 */
export const usernameUpdatedValidator = vine.create({
  userId: vine.string().uuid(),
  username: vine.string(),
})

/**
 * Payload of the `auth.user.deleted` event.
 *
 * Published when a user account is deleted. The Lesson Service removes every
 * lesson authored by this user.
 */
export const userDeletedValidator = vine.create({
  userId: vine.string().uuid(),
})

/**
 * Payload of the `object.file.deleted` event.
 *
 * Published when a file is deleted by a user.
 */
export const fileDeletedValidator = vine.create({
  filename: vine.string(),
  userId: vine.string().uuid(),
})
