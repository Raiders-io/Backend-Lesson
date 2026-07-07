export interface ApiEvent<T> {
  type: string
  payload: T
}

export interface LessonCreatedEvent extends ApiEvent<{
  lessonId: string
  authorId: string
  title?: string
  description?: string
}> {
  type: 'lesson.created'
}

export interface LessonUpdatedEvent extends ApiEvent<{
  lessonId: string
  title?: string
  description?: string
}> {
  type: 'lesson.updated'
}

export interface LessonDeletedEvent extends ApiEvent<{
  lessonId: string
  title?: string
  description?: string
}> {
  type: 'lesson.deleted'
}

export type LessonEvent = LessonCreatedEvent | LessonUpdatedEvent | LessonDeletedEvent
