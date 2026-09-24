import env from '#start/env'
import type { PublishOptions } from '@yosone/broker'

export const STREAM_NAME: string = 'lesson.service'
export const verifyRouteURL = `${env.get('FILE_SERVICE_URL')}${env.get('FILE_VERIFY_ROUTE_URL')}`

export const PublishOpt: PublishOptions = {
  retry: 3,
  retryTime: 1000,
}

export interface UserInfoInterface {
  id: string
  username: string
  email: string
}

export class UserInfo implements UserInfoInterface {
  id: string
  username: string
  email: string

  constructor(info: UserInfoInterface) {
    this.id = info.id
    this.username = info.username
    this.email = info.email
  }
}

export interface LessonDataInterface {
  title?: string
  tags?: number[]
  privacy?: boolean
  description?: string
  username?: string
}

export interface LessonCreatedEvent {
  payload: {
    lessonId: string
    authorId: string
    date: Date
  }
  type: string
}

export interface LessonDeletedEvent {
  payload: {
    lessonId: string
    authorId: string
    date: Date
  }
  type: string
}

export interface LessonUpdatedEvent {
  payload: {
    lessonId: string
    authorId: string
    date: Date
  }
  type: string
}

export interface FileAttachedEvent {
  payload: {
    filename: string | string[]
    lessonId: string
    authorId: string
    date: Date
  }
  type: string
}

export interface FileDetachedEvent {
  payload: {
    filename: string | string[]
    lessonId: string | string[]
    authorId: string
    date: Date
  }
  type: string
}

export interface FileDeletedEvent {
  payload: {
    filename: string
    lessonId: string | string[]
    authorId: string
    date: Date
  }
  type: string
}
