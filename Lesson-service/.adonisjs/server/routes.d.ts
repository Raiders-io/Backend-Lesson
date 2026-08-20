import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'lessons.show_tags': { paramsTuple?: []; params?: {} }
    'lessons.index': { paramsTuple?: []; params?: {} }
    'lessons.show_by_author': { paramsTuple: [ParamValue]; params: {'author': ParamValue} }
    'lessons.show_by_content': { paramsTuple: [ParamValue,ParamValue]; params: {'author': ParamValue,'content': ParamValue} }
    'lessons.store': { paramsTuple?: []; params?: {} }
    'lessons.update_by_content': { paramsTuple: [ParamValue,ParamValue]; params: {'author': ParamValue,'content': ParamValue} }
    'lessons.destroy_by_content': { paramsTuple: [ParamValue,ParamValue]; params: {'author': ParamValue,'content': ParamValue} }
    'lessons.show_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.update_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'lessons.destroy_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'files.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'files.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'searches.index': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'lessons.show_tags': { paramsTuple?: []; params?: {} }
    'lessons.index': { paramsTuple?: []; params?: {} }
    'lessons.show_by_author': { paramsTuple: [ParamValue]; params: {'author': ParamValue} }
    'lessons.show_by_content': { paramsTuple: [ParamValue,ParamValue]; params: {'author': ParamValue,'content': ParamValue} }
    'lessons.show_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'searches.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'lessons.show_tags': { paramsTuple?: []; params?: {} }
    'lessons.index': { paramsTuple?: []; params?: {} }
    'lessons.show_by_author': { paramsTuple: [ParamValue]; params: {'author': ParamValue} }
    'lessons.show_by_content': { paramsTuple: [ParamValue,ParamValue]; params: {'author': ParamValue,'content': ParamValue} }
    'lessons.show_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.show': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
    'searches.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'lessons.store': { paramsTuple?: []; params?: {} }
    'files.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'lessons.update_by_content': { paramsTuple: [ParamValue,ParamValue]; params: {'author': ParamValue,'content': ParamValue} }
    'lessons.update_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.update': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
  }
  DELETE: {
    'lessons.destroy_by_content': { paramsTuple: [ParamValue,ParamValue]; params: {'author': ParamValue,'content': ParamValue} }
    'lessons.destroy_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'files.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'id': ParamValue,'fileId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}