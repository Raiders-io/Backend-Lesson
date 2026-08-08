import LessonHeader from '#models/lesson_header'
import db from '@adonisjs/lucid/services/db'
import { publish } from '@yosone/broker'
import type { LessonCreatedEvent, LessonDeletedEvent } from '@yosone/broker'

export class LessonOperations {
  async storeLesson(lessonModel: LessonHeader, tags: number[]) {
    const lessonId = await db.transaction(async (trx) => {
      lessonModel.useTransaction(trx)
      const lesson = await lessonModel.save()
      if (tags.length > 0) {
        await lessonModel.related('tags').attach(tags, trx)
      }
      try {
        const event: LessonCreatedEvent = {
          payload: {
            lessonId: lesson.lessonId,
            authorId: lesson.authorId,
          },
          type: 'lesson.created',
        }
        await publish('lesson.service', event)
      } catch (error) {
        console.error('Error occurred while publishing lesson creation:', error)
      }
      return lessonModel.lessonId
    })
    return lessonId
  }

  /**
   *  Delete a lesson by its ID,
   *  If authorId is provided it will delete all lesson from this author.
   */

  async deleteLessonById(lessonId: string) {
    const lesson = await LessonHeader.findBy('lessonId', lessonId)
    if (!lesson) return
    lesson.delete()
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
      lessons.forEach(async (lesson) => {
        lesson.useTransaction(trx)
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
      })
    })
  }
}

export default new LessonOperations()
