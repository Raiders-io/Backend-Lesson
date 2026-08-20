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
    router
      .group(() => {
        router.get('/tags', [controllers.Lessons, 'showTags'])

        router.group(() => {
          router.get('/', [controllers.Lessons, 'index'])
          router.post('/', [controllers.Lessons, 'store']).middleware([middleware.verifyToken()])

          router
            .group(() => {
              router.get('/:author', [controllers.Lessons, 'showByAuthor'])
              router.get('/:author/:content', [controllers.Lessons, 'showByContent'])
              router
                .put('/:author/:content', [controllers.Lessons, 'updateByContent'])
                .middleware([middleware.verifyToken()])

              router
                .delete('/:author/:content', [controllers.Lessons, 'destroyByContent'])
                .middleware([middleware.verifyToken()])
            })
            .prefix('/cnt')
        })

        router
          .group(() => {
            router.get('/:id', [controllers.Lessons, 'showById'])

            router
              .put('/:id', [controllers.Lessons, 'updateById'])
              .middleware([middleware.verifyToken()])
            router
              .delete('/:id', [controllers.Lessons, 'destroyById'])
              .middleware([middleware.verifyToken()])
          })
          .prefix('/byId')

        router
          .group(() => {
            router.get('/files/:fileId', [controllers.Files, 'show'])
            router.post('/files', [controllers.Files, 'store'])
            router.put('/files/:fileId', [controllers.Files, 'update'])
            router.delete('/files/:fileId', [controllers.Files, 'destroy'])
          })
          .prefix('/lesson/:id')
          .use(middleware.verifyToken())
      })
      .prefix('/lessons')
    router.get('/search', [controllers.Searches, 'index'])
  })
  .prefix('/api/v1')
