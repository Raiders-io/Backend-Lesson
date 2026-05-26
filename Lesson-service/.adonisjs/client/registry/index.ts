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
  'lessons.index': {
    methods: ["GET","HEAD"],
    pattern: '/lessons',
    tokens: [{"old":"/lessons","type":0,"val":"lessons","end":""}],
    types: placeholder as Registry['lessons.index']['types'],
  },
  'lessons.create': {
    methods: ["GET","HEAD"],
    pattern: '/lessons/create',
    tokens: [{"old":"/lessons/create","type":0,"val":"lessons","end":""},{"old":"/lessons/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['lessons.create']['types'],
  },
  'lessons.store': {
    methods: ["POST"],
    pattern: '/lessons',
    tokens: [{"old":"/lessons","type":0,"val":"lessons","end":""}],
    types: placeholder as Registry['lessons.store']['types'],
  },
  'lessons.show': {
    methods: ["GET","HEAD"],
    pattern: '/lessons/:id',
    tokens: [{"old":"/lessons/:id","type":0,"val":"lessons","end":""},{"old":"/lessons/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['lessons.show']['types'],
  },
  'lessons.edit': {
    methods: ["GET","HEAD"],
    pattern: '/lessons/:id/edit',
    tokens: [{"old":"/lessons/:id/edit","type":0,"val":"lessons","end":""},{"old":"/lessons/:id/edit","type":1,"val":"id","end":""},{"old":"/lessons/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['lessons.edit']['types'],
  },
  'lessons.update': {
    methods: ["PUT","PATCH"],
    pattern: '/lessons/:id',
    tokens: [{"old":"/lessons/:id","type":0,"val":"lessons","end":""},{"old":"/lessons/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['lessons.update']['types'],
  },
  'lessons.destroy': {
    methods: ["DELETE"],
    pattern: '/lessons/:id',
    tokens: [{"old":"/lessons/:id","type":0,"val":"lessons","end":""},{"old":"/lessons/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['lessons.destroy']['types'],
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
