import vine from '@vinejs/vine'

export const tagsSchema = vine.object({
  name: vine.string(),
  id: vine.number(),
})

//TODO Change if wanted to add html/markdown in title/desctiption
export const lessonCreationValidator = vine.create({
  title: vine.string().minLength(1).maxLength(150),
  description: vine.string().maxLength(500).optional(),
  privacy: vine.boolean(),
  tags: vine.array(tagsSchema).minLength(1).maxLength(10),
})

/**
 * Partial update payload: every field is optional, but when provided it must
 * match the same shape as the creation payload.
 */
export const lessonUpdateValidator = vine.create({
  title: vine.string().minLength(1).maxLength(100).optional(),
  description: vine.string().maxLength(500).optional(),
  privacy: vine.boolean().optional(),
  tags: vine.array(tagsSchema).minLength(1).maxLength(10).optional(),
})
