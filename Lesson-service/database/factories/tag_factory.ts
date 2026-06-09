import factory from '@adonisjs/lucid/factories'
import Tag from '#models/tag'

const usedElement = new Set<string>()

export const TagFactory = factory
  .define(Tag, async ({ faker }) => {
    let elementName = faker.science.chemicalElement().name
    while (usedElement.has(elementName)) {
      elementName = faker.science.chemicalElement().name
    }
    usedElement.add(elementName)

    console.log(`Generated tag: ${elementName}`)
    return {
      name: elementName,
    }
  })
  .build()
