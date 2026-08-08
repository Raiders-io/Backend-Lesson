import LessonHeader from '#models/lesson_header'
import db from '@adonisjs/lucid/services/db'
import { publish } from '@yosone/broker'
import type { LessonCreatedEvent, LessonDeletedEvent, LessonUpdatedEvent } from '@yosone/broker'

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
          authorId: lessonModel.authorId,
        },
        type: 'lesson.created',
      }
      await publish('lesson.service', event)
    } catch (error) {
      console.error('Error occurred while publishing lesson creation:', error)
    }
    return lessonId
  }

  async deleteLessonById(lessonId: string) {
    const lesson = await LessonHeader.findBy('lessonId', lessonId)
    if (!lesson) return
    await lesson.delete()
    try {
      const event: LessonDeletedEvent = {
        payload: {
          lessonId: lesson.lessonId,
        },
        type: 'lesson.deleted',
      }
      await publish('lesson.service', event)
    } catch (error) {
      console.error('Error occurred while publishing lesson deletion:', error)
    }
  }

  async deleteLessonsByAuthorId(authorId: string) {
    const lessons = await LessonHeader.findManyBy('authorId', authorId)
    if (!lessons || lessons.length === 0) return
    await db.transaction(async (trx) => {
      for (const lesson of lessons) {
        lesson.useTransaction(trx)
        await lesson.delete()
      }
    })
    for (const lesson of lessons) {
      try {
        const event: LessonDeletedEvent = {
          payload: {
            lessonId: lesson.lessonId,
          },
          type: 'lesson.deleted',
        }
        await publish('lesson.service', event)
      } catch (error) {
        console.error('Error occurred while publishing lesson deletion:', error)
      }
    }
  }

  async updateLesson(lesson: LessonHeader, title?: string, tags?: number[], privacy?: boolean) {
    lesson.title = title ?? lesson.title
    if (title) {
      lesson.slug =
        lesson.slug.split('/')[0] +
        '/' +
        title
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
    try {
      const event: LessonUpdatedEvent = {
        payload: {
          lessonId: lesson.lessonId,
        },
        type: 'lesson.updated',
      }
      await publish('lesson.service', event)
    } catch (error) {
      console.error('Error occurred while publishing lesson update:', error)
    }
  }
}

export default new LessonOperations()
