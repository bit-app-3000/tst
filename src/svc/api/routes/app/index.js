import { Healthy, LoaderIo, LoaderIoToken, Main } from '../../controllers'

export const App = (f, opts, done) => {
  f
    .get('/', Main)
    .get('/healthy', Healthy)
    .get(`/${LoaderIoToken}`, LoaderIo)

  return done()
}
