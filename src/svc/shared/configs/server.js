export * from './'
export * from './paths'

export const IS_DEV = true
export const SERVER_HOST = '0.0.0.0'
export const SERVER_PORT = 8080
export const SERVER_BACKLOG = 551

export const SERVER_OPTS = {
  logger: false,
  ignoreTrailingSlash: true
}

export const API_V1_OPTS = { prefix: '/api', scope: 'v1' }
export const APP_OPTS = { prefix: '/', scope: 'app' }

export const WS_OPTS = {
  pathname: '/',
  compression: true,
  transformer: 'websockets',
  parser: 'JSON',
  port: 9595
  // maxLength: 10485760,
  // methods: 'GET',
  // credentials: true,
  // exposed: true
}

export const LOKI_OPTS = {
  env: 'NODEJS',
  verbose: true
}

export const API_SERVER = IS_DEV ? `http://localhost:${SERVER_PORT}` : `https://${APP_DOMAIN}`
