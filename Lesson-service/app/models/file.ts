import { FileSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import { HasMany } from '@adonisjs/lucid/types/relations'
import LessonHeader from './lesson_header.ts'

export default class File extends FileSchema {
    
    @hasMany(() => File, {
        foreignKey: 'lesson_id',
    })
    declare lessons: HasMany<typeof LessonHeader>
}
