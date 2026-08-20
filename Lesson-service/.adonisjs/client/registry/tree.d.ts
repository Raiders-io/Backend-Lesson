/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  lessons: {
    showTags: typeof routes['lessons.show_tags']
    index: typeof routes['lessons.index']
    showByAuthor: typeof routes['lessons.show_by_author']
    showByContent: typeof routes['lessons.show_by_content']
    store: typeof routes['lessons.store']
    updateByContent: typeof routes['lessons.update_by_content']
    destroyByContent: typeof routes['lessons.destroy_by_content']
    showById: typeof routes['lessons.show_by_id']
    updateById: typeof routes['lessons.update_by_id']
    destroyById: typeof routes['lessons.destroy_by_id']
  }
  files: {
    show: typeof routes['files.show']
    store: typeof routes['files.store']
    update: typeof routes['files.update']
    destroy: typeof routes['files.destroy']
  }
  searches: {
    index: typeof routes['searches.index']
  }
}
