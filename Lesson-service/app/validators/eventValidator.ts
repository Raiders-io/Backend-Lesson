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
 * Payload of the `object.file.deleted` event.
 *
 * Published when a file is deleted by a user.
 */
export const fileDeletedValidator = vine.create({
  filename: vine.string(),
  userId: vine.string().uuid(),
})
