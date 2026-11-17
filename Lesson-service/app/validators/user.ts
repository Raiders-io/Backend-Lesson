import vine from '@vinejs/vine'

export const usernameUpdatedValidator = vine.create({
  userId: vine.string().uuid(),
  username: vine.string(),
})
