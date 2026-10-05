import { UserSchema } from '#database/schema'
import { beforeCreate } from '@adonisjs/lucid/orm'

export default class User extends UserSchema {
  @beforeCreate()
  static assignUuid(user: User) {
    user.id = crypto.randomUUID()
  }
}
