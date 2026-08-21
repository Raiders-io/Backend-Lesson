export const STREAM_NAME: string = 'lesson.service'

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
