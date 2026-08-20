/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'lessons.show_tags': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/lessons/tags',
    tokens: [{"old":"/api/v1/lessons/tags","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/tags","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/tags","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/tags","type":0,"val":"tags","end":""}],
    types: placeholder as Registry['lessons.show_tags']['types'],
  },
  'lessons.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/lessons',
    tokens: [{"old":"/api/v1/lessons","type":0,"val":"api","end":""},{"old":"/api/v1/lessons","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons","type":0,"val":"lessons","end":""}],
    types: placeholder as Registry['lessons.index']['types'],
  },
  'lessons.store': {
    methods: ["POST"],
    pattern: '/api/v1/lessons',
    tokens: [{"old":"/api/v1/lessons","type":0,"val":"api","end":""},{"old":"/api/v1/lessons","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons","type":0,"val":"lessons","end":""}],
    types: placeholder as Registry['lessons.store']['types'],
  },
  'lessons.show_by_author': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/lessons/cnt/:author',
    tokens: [{"old":"/api/v1/lessons/cnt/:author","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/cnt/:author","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/cnt/:author","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/cnt/:author","type":0,"val":"cnt","end":""},{"old":"/api/v1/lessons/cnt/:author","type":1,"val":"author","end":""}],
    types: placeholder as Registry['lessons.show_by_author']['types'],
  },
  'lessons.show_by_content': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/lessons/cnt/:author/:content',
    tokens: [{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"cnt","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":1,"val":"author","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":1,"val":"content","end":""}],
    types: placeholder as Registry['lessons.show_by_content']['types'],
  },
  'lessons.update_by_content': {
    methods: ["PUT"],
    pattern: '/api/v1/lessons/cnt/:author/:content',
    tokens: [{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"cnt","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":1,"val":"author","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":1,"val":"content","end":""}],
    types: placeholder as Registry['lessons.update_by_content']['types'],
  },
  'lessons.destroy_by_content': {
    methods: ["DELETE"],
    pattern: '/api/v1/lessons/cnt/:author/:content',
    tokens: [{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":0,"val":"cnt","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":1,"val":"author","end":""},{"old":"/api/v1/lessons/cnt/:author/:content","type":1,"val":"content","end":""}],
    types: placeholder as Registry['lessons.destroy_by_content']['types'],
  },
  'lessons.show_by_id': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/lessons/byId/:id',
    tokens: [{"old":"/api/v1/lessons/byId/:id","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/byId/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/byId/:id","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/byId/:id","type":0,"val":"byId","end":""},{"old":"/api/v1/lessons/byId/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['lessons.show_by_id']['types'],
  },
  'lessons.update_by_id': {
    methods: ["PUT"],
    pattern: '/api/v1/lessons/byId/:id',
    tokens: [{"old":"/api/v1/lessons/byId/:id","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/byId/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/byId/:id","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/byId/:id","type":0,"val":"byId","end":""},{"old":"/api/v1/lessons/byId/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['lessons.update_by_id']['types'],
  },
  'lessons.destroy_by_id': {
    methods: ["DELETE"],
    pattern: '/api/v1/lessons/byId/:id',
    tokens: [{"old":"/api/v1/lessons/byId/:id","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/byId/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/byId/:id","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/byId/:id","type":0,"val":"byId","end":""},{"old":"/api/v1/lessons/byId/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['lessons.destroy_by_id']['types'],
  },
  'files.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/lessons/lesson/:id/files/:fileId',
    tokens: [{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"lesson","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":1,"val":"id","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"files","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":1,"val":"fileId","end":""}],
    types: placeholder as Registry['files.show']['types'],
  },
  'files.store': {
    methods: ["POST"],
    pattern: '/api/v1/lessons/lesson/:id/files',
    tokens: [{"old":"/api/v1/lessons/lesson/:id/files","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/lesson/:id/files","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/lesson/:id/files","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/lesson/:id/files","type":0,"val":"lesson","end":""},{"old":"/api/v1/lessons/lesson/:id/files","type":1,"val":"id","end":""},{"old":"/api/v1/lessons/lesson/:id/files","type":0,"val":"files","end":""}],
    types: placeholder as Registry['files.store']['types'],
  },
  'files.update': {
    methods: ["PUT"],
    pattern: '/api/v1/lessons/lesson/:id/files/:fileId',
    tokens: [{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"lesson","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":1,"val":"id","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"files","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":1,"val":"fileId","end":""}],
    types: placeholder as Registry['files.update']['types'],
  },
  'files.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/lessons/lesson/:id/files/:fileId',
    tokens: [{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"api","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"v1","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"lessons","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"lesson","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":1,"val":"id","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":0,"val":"files","end":""},{"old":"/api/v1/lessons/lesson/:id/files/:fileId","type":1,"val":"fileId","end":""}],
    types: placeholder as Registry['files.destroy']['types'],
  },
  'searches.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/search',
    tokens: [{"old":"/api/v1/search","type":0,"val":"api","end":""},{"old":"/api/v1/search","type":0,"val":"v1","end":""},{"old":"/api/v1/search","type":0,"val":"search","end":""}],
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
