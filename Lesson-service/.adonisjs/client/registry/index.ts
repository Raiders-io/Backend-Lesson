/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'lessons.show_tags': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/v1/lessons/tags',
    tokens: [
      { old: '/api/v1/lessons/tags', type: 0, val: 'api', end: '' },
      { old: '/api/v1/lessons/tags', type: 0, val: 'v1', end: '' },
      { old: '/api/v1/lessons/tags', type: 0, val: 'lessons', end: '' },
      { old: '/api/v1/lessons/tags', type: 0, val: 'tags', end: '' },
    ],
    types: placeholder as Registry['lessons.show_tags']['types'],
  },
  'lessons.index': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/v1/lessons',
    tokens: [
      { old: '/api/v1/lessons', type: 0, val: 'api', end: '' },
      { old: '/api/v1/lessons', type: 0, val: 'v1', end: '' },
      { old: '/api/v1/lessons', type: 0, val: 'lessons', end: '' },
    ],
    types: placeholder as Registry['lessons.index']['types'],
  },
  'lessons.store': {
    methods: ['POST'],
    pattern: '/api/v1/lessons',
    tokens: [
      { old: '/api/v1/lessons', type: 0, val: 'api', end: '' },
      { old: '/api/v1/lessons', type: 0, val: 'v1', end: '' },
      { old: '/api/v1/lessons', type: 0, val: 'lessons', end: '' },
    ],
    types: placeholder as Registry['lessons.store']['types'],
  },
  'lessons.show': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/v1/lessons/:id',
    tokens: [
      { old: '/api/v1/lessons/:id', type: 0, val: 'api', end: '' },
      { old: '/api/v1/lessons/:id', type: 0, val: 'v1', end: '' },
      { old: '/api/v1/lessons/:id', type: 0, val: 'lessons', end: '' },
      { old: '/api/v1/lessons/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as Registry['lessons.show']['types'],
  },
  'lessons.update': {
    methods: ['PUT', 'PATCH'],
    pattern: '/api/v1/lessons/:id',
    tokens: [
      { old: '/api/v1/lessons/:id', type: 0, val: 'api', end: '' },
      { old: '/api/v1/lessons/:id', type: 0, val: 'v1', end: '' },
      { old: '/api/v1/lessons/:id', type: 0, val: 'lessons', end: '' },
      { old: '/api/v1/lessons/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as Registry['lessons.update']['types'],
  },
  'lessons.destroy': {
    methods: ['DELETE'],
    pattern: '/api/v1/lessons/:id',
    tokens: [
      { old: '/api/v1/lessons/:id', type: 0, val: 'api', end: '' },
      { old: '/api/v1/lessons/:id', type: 0, val: 'v1', end: '' },
      { old: '/api/v1/lessons/:id', type: 0, val: 'lessons', end: '' },
      { old: '/api/v1/lessons/:id', type: 1, val: 'id', end: '' },
    ],
    types: placeholder as Registry['lessons.destroy']['types'],
  },
  'files.show': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/v1/lesson/:id/files/:fileId',
    tokens: [
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'api', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'v1', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'lesson', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 1, val: 'id', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'files', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 1, val: 'fileId', end: '' },
    ],
    types: placeholder as Registry['files.show']['types'],
  },
  'files.store': {
    methods: ['POST'],
    pattern: '/api/v1/lesson/:id/files',
    tokens: [
      { old: '/api/v1/lesson/:id/files', type: 0, val: 'api', end: '' },
      { old: '/api/v1/lesson/:id/files', type: 0, val: 'v1', end: '' },
      { old: '/api/v1/lesson/:id/files', type: 0, val: 'lesson', end: '' },
      { old: '/api/v1/lesson/:id/files', type: 1, val: 'id', end: '' },
      { old: '/api/v1/lesson/:id/files', type: 0, val: 'files', end: '' },
    ],
    types: placeholder as Registry['files.store']['types'],
  },
  'files.update': {
    methods: ['PUT'],
    pattern: '/api/v1/lesson/:id/files/:fileId',
    tokens: [
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'api', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'v1', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'lesson', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 1, val: 'id', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'files', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 1, val: 'fileId', end: '' },
    ],
    types: placeholder as Registry['files.update']['types'],
  },
  'files.destroy': {
    methods: ['DELETE'],
    pattern: '/api/v1/lesson/:id/files/:fileId',
    tokens: [
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'api', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'v1', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'lesson', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 1, val: 'id', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 0, val: 'files', end: '' },
      { old: '/api/v1/lesson/:id/files/:fileId', type: 1, val: 'fileId', end: '' },
    ],
    types: placeholder as Registry['files.destroy']['types'],
  },
  'searches.index': {
    methods: ['GET', 'HEAD'],
    pattern: '/api/v1/search',
    tokens: [
      { old: '/api/v1/search', type: 0, val: 'api', end: '' },
      { old: '/api/v1/search', type: 0, val: 'v1', end: '' },
      { old: '/api/v1/search', type: 0, val: 'search', end: '' },
    ],
    types: placeholder as Registry['searches.index']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
