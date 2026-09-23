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
import { verify } from 'node:crypto'

router
  .group(() => {
    router
      .group(() => {
        router.get('/tags', [controllers.Lessons, 'showTags'])

        router.group(() => {
          router.get('/', [controllers.Lessons, 'index'])
          router.post('/', [controllers.Lessons, 'store'])

          router
            .group(() => {
              router.get('/:author', [controllers.Lessons, 'showByAuthor'])
              router.get('/:author/:content', [controllers.Lessons, 'showByContent'])
              router.put('/:author/:content', [controllers.Lessons, 'updateByContent'])
              router.delete('/:author/:content', [controllers.Lessons, 'destroyByContent'])
            })
            .prefix('/cnt')
        })

        router
          .group(() => {
            router.get('/:id', [controllers.Lessons, 'showById'])

            router.put('/:id', [controllers.Lessons, 'updateById'])
            router.delete('/:id', [controllers.Lessons, 'destroyById'])

            router
              .group(() => {
                router.get('/', [controllers.Files, 'index'])
                router.post('/', [controllers.Files, 'store'])
                router.put('/', [controllers.Files, 'update'])
                router.delete('/', [controllers.Files, 'destroy'])
                router.get('/:file', [controllers.Files, 'show'])
              })
              .prefix('/:id/files')
          })
          .prefix('/byId')
        router
          .group(() => {
            router.delete('/:file', [controllers.Files, 'destroyByFile'])
            router.get('/:file', [controllers.Files, 'showLessons'])
          })
          .prefix('/file')
      })
      .prefix('/lessons')
    router.get('/search', [controllers.Searches, 'index'])
  })
  .prefix('/api/v1')
  .middleware([middleware.verifyToken()])
