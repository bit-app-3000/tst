const Centrifuge = require('centrifuge')
const { default: SignJWT } = require('jose/jwt/sign')
const { createSecretKey } = require('crypto')
const WsClient = require('ws')
const { log: LOG, error: ERR } = console

// const uri = 'ws://localhost/connection/websocket'
// const uri = 'wss://fobos.app/connection/websocket'
const uri = 'wss://ws.fobos.app/hub'
// const uri = 'ws://localhost/ws'
const user = 'bt'
const privateKey = createSecretKey('s0DUdTauvlfLlYIGLQCjoWF8DksuudUM')

const TOKEN = payload =>
  new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user)
    .setIssuedAt()
    .setIssuer('localhost')
    .setIssuer('maap')
    .setAudience('dashboard')
    .setExpirationTime('2h')
    .sign(privateKey)

const callbacks = {
  'publish': function (message) {
    // See below description of message format
    LOG('publish', message)
  },
  'join': function (message) {
    // See below description of join message format
    LOG('join', message)
  },
  'leave': function (message) {
    // See below description of leave message format
    LOG('leave', message)
  },
  'subscribe': function (context) {
    // See below description of subscribe callback context format
    LOG('subscribe', context)
  },
  'error': function (err) {
    // See below description of subscribe error callback context format
    LOG('error', err)
  },
  'unsubscribe': function (context) {
    // See below description of unsubscribe event callback context format
    LOG('unsubscribe', context)
  }
}

const centrifuge = new Centrifuge(uri, {
  debug: true,
  websocket: WsClient
})

centrifuge.subscribe('test', callbacks)

centrifuge.on('connect', LOG)

centrifuge.on('connect', function(res){
  LOG('connect', res)
})

centrifuge.on('disconnect', function(res){
  LOG('disconnect', res)
})

// const connect = async () => {
//
//   // const token = await TOKEN({ info: { name: 'BT' } }).catch(ERR)
//   //
//   // centrifuge.setToken(token)
//
//   centrifuge.connect()
// }
//
// connect().catch(ERR)

centrifuge.connect()






