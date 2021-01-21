import { inspect } from 'util'
import server from 'fastify'
import { APP_OPTS, SERVER_BACKLOG, SERVER_HOST, SERVER_OPTS, SERVER_PORT } from './configs'
import { Init } from './modules'
import { App } from './routes'

inspect.defaultOptions = { depth: null }

const app = server(SERVER_OPTS)

app
  .register(App, APP_OPTS)
  .listen(SERVER_PORT, SERVER_HOST, SERVER_BACKLOG, Init)
