import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'lessons.show_tags': { paramsTuple?: []; params?: {} }
    'lessons.index': { paramsTuple?: []; params?: {} }
    'lessons.store': { paramsTuple?: []; params?: {} }
    'lessons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'files.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'files.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'searches.index': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'lessons.show_tags': { paramsTuple?: []; params?: {} }
    'lessons.index': { paramsTuple?: []; params?: {} }
    'lessons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'searches.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'lessons.show_tags': { paramsTuple?: []; params?: {} }
    'lessons.index': { paramsTuple?: []; params?: {} }
    'lessons.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'searches.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'lessons.store': { paramsTuple?: []; params?: {} }
    'files.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'lessons.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
  }
  PATCH: {
    'lessons.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'lessons.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}