import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  /**
   * Enable or disable CORS handling globally.
   *
   * CORS stays disabled on purpose: this service is only reachable through
   * the API gateway, which is responsible for applying the browser CORS
   * policy. The options below are therefore not in effect; if CORS is ever
   * enabled here, replace the wildcard origin with an explicit allowlist
   * before keeping `credentials: true`.
   */
  enabled: false,

  /**
   * Not used while CORS is disabled (see above).
   */
  origin: '*',

  /**
   * HTTP methods accepted for cross-origin requests.
   */
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],

  /**
   * Reflect request headers by default. Use a string array to restrict
   * allowed headers.
   */
  headers: true,

  /**
   * Response headers exposed to the browser.
   */
  exposeHeaders: [],

  /**
   * Allow cookies/authorization headers on cross-origin requests.
   */
  credentials: true,

  /**
   * Cache CORS preflight response for N seconds.
   */
  maxAge: 90,
})

export default corsConfig
