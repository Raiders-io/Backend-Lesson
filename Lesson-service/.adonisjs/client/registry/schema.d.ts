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
  'lessons.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/lessons/:author/:contentId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { author: ParamValue; contentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['show']>>>
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
  'lessons.update': {
    methods: ["PUT"]
    pattern: '/api/v1/lessons/:contentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { contentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['update']>>>
    }
  }
  'lessons.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/lessons/:contentId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { contentId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['destroy']>>>
    }
  }
  'files.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/lesson/:id/files/:fileId'
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
    pattern: '/api/v1/lesson/:id/files'
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
    pattern: '/api/v1/lesson/:id/files/:fileId'
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
    pattern: '/api/v1/lesson/:id/files/:fileId'
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
