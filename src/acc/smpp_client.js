const smpp = require('smpp')


const { log: LOG, error: ERR } = console

const SMPP_PORT = 2775
const SMPP_HOST = '127.0.0.1'
const SMPP_URL = `smpp://${SMPP_HOST}:${SMPP_PORT}`

const system_id = 'postest1'
const password = 'dyhfdrmn'
const destination_addr = '+38063384552'
const source_addr = 'Maap:Test'
const short_message = `Maap:Test SMS! ${Date.now()}`
const registered_delivery = 1

const session = smpp.connect(SMPP_URL)

let rpc = 0

const submitCallBack = pdu => {
  if (pdu.command_status == 0){
    ++ rpc
   // LOG('Success: ', pdu.message_id)
  }
}

const parsDLR = dlr =>
  dlr
    .split(' ')
    .reduce((a, i) => {
      
      // id:5fcfdad1-c8bf-2410-5286-91bc3377f167 sub:001 dlvrd:001 submit date:2012151145 done date:2012151145 stat:UNDELIV err:001 text:-
     
      
      const [k, v] = i.replace(':', '\x01').split('\x01')
      
      a[k] = v
      return a
    }, {})

const deliveryCallBack = pdu => {
  if (pdu.esm_class === 4) {
   // LOG('DLR:', pdu)
    session.send(pdu.response())
  }
}

const submit = params => {
  session.submit_sm(params, submitCallBack)
 // session.close(() => LOG('close session'))
}

const bind = pdu => {
  LOG('Successfully bound')
  if (pdu.command_status == 0)
    submit({ destination_addr, source_addr, short_message, registered_delivery })
}

session.on('error', ERR)
session.on('deliver_sm', deliveryCallBack)
session.bind_transceiver({ system_id, password }, bind)


setInterval(() => {
  LOG(rpc)
  rpc = 0
}, 1000)

const sender = () => {
  let i = 100
  while (i--)
    submit({ destination_addr, source_addr, short_message, registered_delivery })
}

setInterval(sender, 50)
