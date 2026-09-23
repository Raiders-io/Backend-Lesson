import vine from '@vinejs/vine'

export const fileOwnershipValidator = vine.create({
  found: vine.array(vine.string()),
  notfound: vine.array(vine.string()),
})

export const fileDataValidator = vine.create({
  files: vine.array(vine.string()),
})
