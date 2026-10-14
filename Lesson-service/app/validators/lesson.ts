import vine from '@vinejs/vine'

export const tagsSchema = vine.object({
  name: vine.string(),
  id: vine.number(),
})

export const lessonCreationValidator = vine.create({
  title: vine.string(),
  description: vine.string().optional(),
  privacy: vine.boolean(),
  tags: vine.array(tagsSchema).minLength(1),
})
