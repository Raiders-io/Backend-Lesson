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
          router.get('/', [controllers.Lessons, 'index']) // Remove ?
          router.post('/', [controllers.Lessons, 'store']) //Create new lesson

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
                router.get('/', [controllers.Files, 'index']) //All file of a lesson
                router.post('/', [controllers.Files, 'store']) //Upload new file to a lesson
                // router.put('/', [controllers.Files, 'update']) // Update files is not revalent for now
                router.delete('/', [controllers.Files, 'destroy']) //Delete files from a lesson (In body)
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
          .prefix('/files')
      })
      .prefix('/lessons')
    router.get('/search', [controllers.Searches, 'index'])
  })
  .prefix('/api/v1')
  .middleware([middleware.verifyToken()])
