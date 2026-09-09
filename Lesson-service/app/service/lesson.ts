import LessonHeader from '#models/lesson_header'
import db from '@adonisjs/lucid/services/db'
import { publish } from '@yosone/broker'
import { STREAM_NAME } from '#types'
import type { LessonDataInterface } from '#types'
import type {
  LessonCreatedEvent,
  LessonDeletedEvent,
  LessonUpdatedEvent,
  PublishOptions,
} from '@yosone/broker'

const PublishOptions: PublishOptions = {
  retry: 3,
  retryTime: 10000,
}

//TODO add check for privacy setting in all getter
//TODO add preload for the file
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
      const event: LessonCreatedEvent = {
        payload: {
          lessonId: lessonId,
          authorId: lessonModel.author,
        },
        type: 'lesson.created',
      }
      publish(STREAM_NAME, event, PublishOptions)
    } catch (error) {
      console.error('Error occurred while publishing lesson creation:', error)
    }
    return lessonId
  }

  async deleteLessonById(lessonId: string) {
    const lesson = await LessonHeader.findBy('lessonId', lessonId)
    if (!lesson) return
    await lesson.delete()
    const event: LessonDeletedEvent = {
      payload: {
        lessonId: lessonId,
      },
      type: 'lesson.deleted',
    }
    publish(STREAM_NAME, event, PublishOptions)
  }

  async deleteLessonsByAuthor(author: string) {
    const lessons = await LessonHeader.findManyBy('author', author)
    if (!lessons || lessons.length === 0) return
    await db.transaction(async (trx) => {
      for (const lesson of lessons) {
        lesson.useTransaction(trx)
        await lesson.delete()
      }
    })
    for (const lesson of lessons) {
      const event: LessonDeletedEvent = {
        payload: {
          lessonId: lesson.lessonId,
        },
        type: 'lesson.deleted',
      }
      publish(STREAM_NAME, event, PublishOptions)
    }
  }

  async updateLesson(lesson: LessonHeader, lessonData: LessonDataInterface) {
    lesson.title = lessonData.title ?? lesson.title
    if (lessonData.title) {
      lesson.slug = lessonData.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    }

    const duplicate = await LessonHeader.query()
      .where('author', lesson.author)
      .where('slug', lesson.slug)
      .whereNot('lessonId', lesson.lessonId)
      .first()

    if (duplicate) {
      throw new Error('A lesson with the same title already exists')
    }

    lesson.isPrivate = lessonData.privacy ?? lesson.isPrivate
    lesson.description = lessonData.description ?? lesson.description
    lesson.author = lessonData.username ?? lesson.author
    const currTags = lessonData.tags?.length
      ? lessonData.tags
      : Array.from(lesson.tags, (tag) => tag.id)

    await db.transaction(async (trx) => {
      lesson.useTransaction(trx)
      await lesson.save()
      await lesson.related('tags').sync(currTags)
    })
    const event: LessonUpdatedEvent = {
      payload: {
        lessonId: lesson.lessonId,
      },
      type: 'lesson.updated',
    }
    publish(STREAM_NAME, event, PublishOptions)
  }

  async getLessonByAuthor(author: string) {
    const lessons = await LessonHeader.query().where('author', author).preload('tags')
    return lessons
  }

  async getLessonByAuthorAndContent(author: string, content: string) {
    const lesson = await LessonHeader.query()
      .where('author', author)
      .where('slug', content)
      .preload('tags')
    return lesson
  }

  async getLessonById(lessonId: string) {
    const lesson = await LessonHeader.findBy('lessonId', lessonId)
    return lesson
  }

  async getLessonByAuthorId(authorId: string) {
    const lessons = await LessonHeader.findManyBy('authorId', authorId)
    return lessons
  }

  async getLessonsByIds(lessonIds: string[]) {
    return await LessonHeader.query().where('lesson_id', lessonIds)
  }
}

export default new LessonOperations()
