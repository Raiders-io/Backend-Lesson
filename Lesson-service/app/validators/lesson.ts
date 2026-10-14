import vine from '@vinejs/vine'

export const tagsSchema = vine.object({
  name: vine.string(),
  id: vine.number(),
})

export const lessonCreationValidator = vine.create({
  title: vine
    .string()
    .alphaNumeric({
      allowDashes: true,
      allowSpaces: true,
      allowUnderscores: true,
    })
    .minLength(1)
    .maxLength(100),
  description: vine
    .string()
    .alphaNumeric({
      allowDashes: true,
      allowSpaces: true,
      allowUnderscores: true,
    })
    .maxLength(500)
    .optional(),
  privacy: vine.boolean(),
  tags: vine.array(tagsSchema).minLength(1).maxLength(10),
})
