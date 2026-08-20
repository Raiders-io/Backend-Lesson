/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'lessons.show_tags': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/lessons/tags'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['showTags']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['showTags']>>>
    }
  }
  'lessons.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/lessons'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['index']>>>
    }
  }
  'lessons.show_by_author': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/lessons/:author'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { author: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['showByAuthor']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['showByAuthor']>>>
    }
  }
  'lessons.show_by_content': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/lessons/:author/:content'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { author: ParamValue; content: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['showByContent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['showByContent']>>>
    }
  }
  'lessons.store': {
    methods: ["POST"]
    pattern: '/api/v1/lessons'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['store']>>>
    }
  }
  'lessons.update_by_content': {
    methods: ["PUT"]
    pattern: '/api/v1/lessons/:author/:content'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { author: ParamValue; content: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['updateByContent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['updateByContent']>>>
    }
  }
  'lessons.destroy_by_content': {
    methods: ["DELETE"]
    pattern: '/api/v1/lessons/:author/:content'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { author: ParamValue; content: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['destroyByContent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['destroyByContent']>>>
    }
  }
  'lessons.show_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/lessons/byId/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['showById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['showById']>>>
    }
  }
  'lessons.update_by_id': {
    methods: ["PUT"]
    pattern: '/api/v1/lessons/byId/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['updateById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['updateById']>>>
    }
  }
  'lessons.destroy_by_id': {
    methods: ["DELETE"]
    pattern: '/api/v1/lessons/byId/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['destroyById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['destroyById']>>>
    }
  }
  'files.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/lessons/lesson/:id/files/:fileId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; fileId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/files_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/files_controller').default['show']>>>
    }
  }
  'files.store': {
    methods: ["POST"]
    pattern: '/api/v1/lessons/lesson/:id/files'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/files_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/files_controller').default['store']>>>
    }
  }
  'files.update': {
    methods: ["PUT"]
    pattern: '/api/v1/lessons/lesson/:id/files/:fileId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; fileId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/files_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/files_controller').default['update']>>>
    }
  }
  'files.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/lessons/lesson/:id/files/:fileId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; fileId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/files_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/files_controller').default['destroy']>>>
    }
  }
  'searches.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/search'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/searches_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/searches_controller').default['index']>>>
    }
  }
}
