/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'OuiWorld' }
})

router.get('/lessons/tags', [controllers.Lessons, 'showByTags'])

router.resource('lessons', controllers.Lessons).apiOnly

router
  .group(() => {
    router.get('/files/:fileId', [controllers.Files, 'show'])
    router.post('/files', [controllers.Files, 'store'])
    router.put('/files/:fileId', [controllers.Files, 'update'])
    router.delete('/files/:fileId', [controllers.Files, 'destroy'])
  })
  .prefix('/lesson/:id')

router.get('/search', [controllers.Searches, 'index'])

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
