/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  lessons: {
    showTags: typeof routes['lessons.show_tags']
    index: typeof routes['lessons.index']
    store: typeof routes['lessons.store']
    show: typeof routes['lessons.show']
    update: typeof routes['lessons.update']
    destroy: typeof routes['lessons.destroy']
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
