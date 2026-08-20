import LessonHeader from '#models/lesson_header'
import db from '@adonisjs/lucid/services/db'
import { publish } from '@yosone/broker'
import type {
  LessonCreatedEvent,
  LessonDeletedEvent,
  LessonUpdatedEvent,
  PublishOptions,
} from '@yosone/broker'

const STREAM_NAME: string = 'lesson.service'

const PublishOptions: PublishOptions = {
  retry: 3,
  retryTime: 10000,
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

  async deleteLessonsByauthor(author: string) {
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

  async updateLesson(lesson: LessonHeader, title?: string, tags?: number[], privacy?: boolean) {
    lesson.title = title ?? lesson.title
    if (title) {
      lesson.slug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    }
    lesson.isPrivate = privacy ?? lesson.isPrivate
    const currTags = tags ?? Array.from(lesson.tags, (tag) => tag.id)

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
    const lessons = await LessonHeader.findManyBy('author', author)
    return lessons
  }

  async getLessonByAuthorAndContent(author: string, contentId: string) {
    const lessons = await LessonHeader.findManyBy('author', author)
    const lesson = lessons.find((content) => content.slug === contentId)
    return lesson
  }

  async getLessonById(lessonId: string) {
    const lesson = await LessonHeader.findBy('lessonId', lessonId)
    return lesson
  }

  async getLessonByAuthorID(authorId: string) {
    const lessons = await LessonHeader.findManyBy('authorId', authorId)
    return lessons
  }
}

export default new LessonOperations()
