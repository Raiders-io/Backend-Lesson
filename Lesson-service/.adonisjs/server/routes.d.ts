import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'lessons.show_by_tags': { paramsTuple?: []; params?: {} }
    'files.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'files.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'files.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'searches.index': { paramsTuple?: []; params?: {} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'lessons.show_by_tags': { paramsTuple?: []; params?: {} }
    'files.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'searches.index': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'lessons.show_by_tags': { paramsTuple?: []; params?: {} }
    'files.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'searches.index': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'files.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'files.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
  }
  DELETE: {
    'files.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}