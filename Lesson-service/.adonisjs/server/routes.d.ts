import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'lessons.index': { paramsTuple?: []; params?: {} }
    'lessons.create': { paramsTuple?: []; params?: {} }
    'lessons.store': { paramsTuple?: []; params?: {} }
    'lessons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'lessons.index': { paramsTuple?: []; params?: {} }
    'lessons.create': { paramsTuple?: []; params?: {} }
    'lessons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'lessons.index': { paramsTuple?: []; params?: {} }
    'lessons.create': { paramsTuple?: []; params?: {} }
    'lessons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'lessons.store': { paramsTuple?: []; params?: {} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'lessons.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'lessons.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'lessons.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}