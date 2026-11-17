import LessonHeader from '#models/lesson_header'
import db from '@adonisjs/lucid/services/db'
import { publish } from '@yosone/broker'
import { STREAM_NAME, PublishOpt, type LessonDataInterface } from '#utils/types'
import { ErrorMessage } from '#utils/message'
import EventGenerator from '#service/event'
import { slugify } from '#utils/slug'

//TODO add check for privacy setting in all getter
//TODO add preload for the file
function filterPrivate(lessons: LessonHeader[] | null, userId?: string) {
  if (!lessons) return null
  const filtered = lessons.filter((lesson) => !lesson.isPrivate || lesson.authorId === userId)
  return filtered.length > 0 ? filtered : null
}

function isAccessble(lesson: LessonHeader | null, userId?: string) {
  if (!lesson) return false
  return !lesson.isPrivate || lesson.authorId === userId
}

export class LessonOperations {
  async storeLesson(lessonModel: LessonHeader, tags: number[]) {
    const lessonId = await db.transaction(async (trx) => {
      lessonModel.useTransaction(trx)
      const lesson = await lessonModel.save()
      if (tags.length > 0) {
        await lessonModel.related('tags').attach(tags, trx)
      }
      return lesson.lessonId
    })
    try {
      const event = EventGenerator.lessonCreated(lessonId, lessonModel.authorId)
      publish(STREAM_NAME, event, PublishOpt)
    } catch (error) {
      console.error('Error occurred while publishing lesson creation:', error)
    }
    return lessonId
  }

  async deleteLessonById(lessonId: string) {
    const lesson = await LessonHeader.findBy('lesson_id', lessonId)
    if (!lesson) return
    await lesson.delete()
    try {
      const event = EventGenerator.lessonDeleted(lessonId, lesson.authorId)
      publish(STREAM_NAME, event, PublishOpt)
    } catch (error) {
      console.error('Error occurred while publishing lesson deletion:', error)
    }
  }

  async deleteLessonsByAuthor(authorId: string) {
    const lessons = await LessonHeader.query()
      .where('author_id', authorId)
      .delete()
      .returning('lesson_id')
    if (!lessons || lessons.length === 0) return
    // Write queries bypass Lucid's model hydration and return raw driver rows,
    // so the column is exposed using its snake_case database name.
    const lessonIds = lessons.map((lesson) => lesson.lesson_id)
    try {
      const event = EventGenerator.lessonDeleted(lessonIds, authorId)
      publish(STREAM_NAME, event, PublishOpt)
    } catch (error) {
      console.error('Error occurred while publishing bulk lesson deletion:', error)
    }
  }

  async updateLesson(lesson: LessonHeader, lessonData: LessonDataInterface) {
    lesson.title = lessonData.title ?? lesson.title
    if (lessonData.title) {
      const slug = slugify(lessonData.title)
      if (!slug) throw new Error(ErrorMessage.Lessons.NoTitle)
      lesson.slug = slug
    }

    const duplicate = await LessonHeader.query()
      .where('author_id', lesson.authorId)
      .where('slug', lesson.slug)
      .whereNot('lessonId', lesson.lessonId)
      .first()

    if (duplicate) {
      throw new Error(ErrorMessage.Lessons.Collision)
    }

    lesson.isPrivate = lessonData.privacy ?? lesson.isPrivate
    lesson.description = lessonData.description ?? lesson.description

    const newTagIds = lessonData.tags?.length ? lessonData.tags.map((t) => t.id) : null

    await db.transaction(async (trx) => {
      lesson.useTransaction(trx)
      await lesson.save()
      if (newTagIds) await lesson.related('tags').sync(newTagIds)
    })
    try {
      const event = EventGenerator.lessonUpdated(lesson.lessonId, lesson.authorId)
      publish(STREAM_NAME, event, PublishOpt)
    } catch (error) {
      console.error('Error occurred while publishing lesson update:', error)
    }
  }

  async getLessonByAuthor(authorId: string, userId?: string) {
    const lessons = await LessonHeader.query()
      .where('author_id', authorId)
      .preload('tags')
      .preload('author')

    return filterPrivate(lessons, userId)
  }

  async getLessonByAuthorAndContent(authorId: string, content: string, userId?: string) {
    const lesson = await LessonHeader.query()
      .where('author_id', authorId)
      .where('slug', content)
      .preload('tags')
      .preload('author')
      .first()

    return isAccessble(lesson, userId) ? lesson : null
  }

  async getLessonById(lessonId: string, userId?: string) {
    const lesson = await LessonHeader.findBy('lesson_id', lessonId)

    return isAccessble(lesson, userId) ? lesson : null
  }

  async getLessonByAuthorId(authorId: string, userId?: string) {
    const lessons = await LessonHeader.findManyBy('author_id', authorId)

    return filterPrivate(lessons, userId)
  }

  async getLessonsByIds(lessonIds: string[], userId?: string) {
    return filterPrivate(await LessonHeader.query().whereIn('lesson_id', lessonIds), userId)
  }
}

export default new LessonOperations()
