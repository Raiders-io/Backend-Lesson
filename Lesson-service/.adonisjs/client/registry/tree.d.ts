/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  lessons: {
    showByTags: typeof routes['lessons.show_by_tags']
    index: typeof routes['lessons.index']
    create: typeof routes['lessons.create']
    store: typeof routes['lessons.store']
    show: typeof routes['lessons.show']
    edit: typeof routes['lessons.edit']
    update: typeof routes['lessons.update']
    destroy: typeof routes['lessons.destroy']
  }
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
}
