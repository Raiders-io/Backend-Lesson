/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'lessons.show_by_tags': {
    methods: ["GET","HEAD"],
    pattern: '/lessons/tags',
    tokens: [{"old":"/lessons/tags","type":0,"val":"lessons","end":""},{"old":"/lessons/tags","type":0,"val":"tags","end":""}],
    types: placeholder as Registry['lessons.show_by_tags']['types'],
  },
  'files.show': {
    methods: ["GET","HEAD"],
    pattern: '/lesson/:id/files/:fileId',
    tokens: [{"old":"/lesson/:id/files/:fileId","type":0,"val":"lesson","end":""},{"old":"/lesson/:id/files/:fileId","type":1,"val":"id","end":""},{"old":"/lesson/:id/files/:fileId","type":0,"val":"files","end":""},{"old":"/lesson/:id/files/:fileId","type":1,"val":"fileId","end":""}],
    types: placeholder as Registry['files.show']['types'],
  },
  'files.store': {
    methods: ["POST"],
    pattern: '/lesson/:id/files',
    tokens: [{"old":"/lesson/:id/files","type":0,"val":"lesson","end":""},{"old":"/lesson/:id/files","type":1,"val":"id","end":""},{"old":"/lesson/:id/files","type":0,"val":"files","end":""}],
    types: placeholder as Registry['files.store']['types'],
  },
  'files.update': {
    methods: ["PUT"],
    pattern: '/lesson/:id/files/:fileId',
    tokens: [{"old":"/lesson/:id/files/:fileId","type":0,"val":"lesson","end":""},{"old":"/lesson/:id/files/:fileId","type":1,"val":"id","end":""},{"old":"/lesson/:id/files/:fileId","type":0,"val":"files","end":""},{"old":"/lesson/:id/files/:fileId","type":1,"val":"fileId","end":""}],
    types: placeholder as Registry['files.update']['types'],
  },
  'files.destroy': {
    methods: ["DELETE"],
    pattern: '/lesson/:id/files/:fileId',
    tokens: [{"old":"/lesson/:id/files/:fileId","type":0,"val":"lesson","end":""},{"old":"/lesson/:id/files/:fileId","type":1,"val":"id","end":""},{"old":"/lesson/:id/files/:fileId","type":0,"val":"files","end":""},{"old":"/lesson/:id/files/:fileId","type":1,"val":"fileId","end":""}],
    types: placeholder as Registry['files.destroy']['types'],
  },
  'searches.index': {
    methods: ["GET","HEAD"],
    pattern: '/search',
    tokens: [{"old":"/search","type":0,"val":"search","end":""}],
    types: placeholder as Registry['searches.index']['types'],
  },
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
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
