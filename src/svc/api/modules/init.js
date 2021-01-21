import { APP_NAME, APP_VERSION, SERVER_PORT } from '../configs'

const info = `${String.fromCharCode(9763)} ${APP_NAME} v.${APP_VERSION} : ${SERVER_PORT} MRFCA`

export const Init = err => (
  err
    ? console.error(err)
    : console.info(info)
)
