/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  lessons: {
    showByTags: typeof routes['lessons.show_by_tags']
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
