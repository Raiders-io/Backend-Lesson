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

router
  .group(() => {
    router.get('/lessons/tags', [controllers.Lessons, 'showTags'])

    router.group(() => {
      router.get('lessons', [controllers.Lessons, 'index'])
      router.get('lessons/:author', [controllers.Lessons, 'showByAuthor'])
      router.get('lessons/:author/:contentId', [controllers.Lessons, 'show'])
      router.post('lessons', [controllers.Lessons, 'store']).middleware([middleware.verifyToken()])
      router
        .put('lessons/:contentId', [controllers.Lessons, 'update'])
        .middleware([middleware.verifyToken()])
      router
        .delete('lessons/:contentId', [controllers.Lessons, 'destroy'])
        .middleware([middleware.verifyToken()])
    })
    router
      .group(() => {
        router.get('/files/:fileId', [controllers.Files, 'show'])
        router.post('/files', [controllers.Files, 'store'])
        router.put('/files/:fileId', [controllers.Files, 'update'])
        router.delete('/files/:fileId', [controllers.Files, 'destroy'])
      })
      .prefix('/lesson/:id')
      .use(middleware.verifyToken())

    router.get('/search', [controllers.Searches, 'index'])
  })
  .prefix('/api/v1')
