const Client = require('smpp')

const { log: LOG, error: ERR } = console

const z = {
  
  system_id: 'postest1',
  password: 'dyhfdrmn',
  
  // system_id: 'newsys',
  // password: 'mbbemhbw',
  
  destination_addr: '+38063384552',
  source_addr: 'Maap:Test',
  short_message: `Maap:Test SMS! ${Date.now()}`
  
}

const { system_id, password, destination_addr, source_addr, short_message } = z

const connectCallBack = () => {
  LOG('connect')
}

const deliveryCallBack = pdu => {
  if (pdu.esm_class === 4) {
    LOG('Received DR: %s', pdu.short_message)
    session.send(pdu.response())
  }
}

const url = 'smpp://130.211.49.39:3003'

const session = Client.connect(url, connectCallBack)
session.on('deliver_sm', deliveryCallBack)

const submitCallBack = pdu => pdu.command_status === 0 && LOG('submit_sm', pdu.message_id)

const bindCallBack = pdu => {
  
  LOG('bindCallBack', pdu)
  
  if (pdu.command_status === 0) {
    
    const send = {
      registered_delivery: 1,
      source_addr,
      destination_addr,
      short_message
    }
    
    session.submit_sm(send, submitCallBack)
  }
}

if (session) {
  const params = { system_id, password }
  session.bind_transceiver(params, bindCallBack)
}
