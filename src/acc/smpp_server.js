const smpp = require('smpp')



const { log: LOG, error: ERR } = console
const SMPP_PORT = 2775
const SMPP_HOST = '127.0.0.1'


let rpc = 0



const guid = () =>
  [2, 1, 1, 1, 3].reduce((a, i, x) => {
    if (x) a += '-'
    while (i--) {
      a += Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return a
  }, '')

const obj2dlr = obj =>
  Object
    .entries(obj)
    .reduce((a, [k, v]) => (a += `${k}:${v} `), '')
    .trim()

const listener = session => {
  
  const checkAsyncUserPass = pdu => {
    
    session.pause()
    
    const err = false
    
    if (err) {
      session.send(pdu.response({ command_status: smpp.ESME_RBINDFAIL }))
      session.close()
      return
    }
    
    session.send(pdu.response({ system_id: 'mmd_sms' }))
    session.resume()
    
  }
  const submitCallBack = pdu => {
  
    const { sequence_number, destination_addr, source_addr, short_message } = pdu
    const message_id = guid()
    const time = Math.floor(new Date() / 1000)

    const text = short_message.message
    
    
    const message = Buffer.from(obj2dlr({
      id: message_id,
      sub: '001',
      dlvrd: '0',
      'submit date': time,
      'done date': time,
      stat: 'ACCEPTD',
      err: '000',
      text
    }))
    
    const dlr = {
      command_id: 4,
      command_status: '',
      sequence_number,
      service_type: '',
      source_addr_ton: '',
      source_addr_npi: '',
      source_addr,
      dest_addr_ton: 1,
      dest_addr_npi: 1,
      destination_addr,
      esm_class: 4,
      protocol_id: 1,
      priority_flag: 1,
      schedule_delivery_time: '',
      validity_period: '',
      registered_delivery: 1,
      replace_if_present_flag: '',
      sm_default_msg_id: '',
      short_message: { message }
    }
    
    const response = {
      sequence_number,
      message_id
    }
    
    //sending first dlr
    session.deliver_sm(dlr)
    
    //sending pdu submit
    session.send(pdu.response(response))
  
    ++rpc
    
  }
  const deliverCallBack = pdu => {
   //  LOG('deliverCallBack')
  }
  
  
  session.on('bind_transceiver', checkAsyncUserPass)
  session.on('submit_sm', submitCallBack)
  session.on('deliver_sm_resp', deliverCallBack)
  
  session.on('unbind', function (pdu) {
    LOG('unbind')
    session.send(pdu.response())
    session.close()
  })
  
  session.on('enquire_link', function (pdu) {
    LOG('enquire_link')
    session.send(pdu.response())
  })
  
}

const server = smpp.createServer({}, listener)
server.listen(SMPP_PORT, SMPP_HOST, LOG(`SMPP Server on : ${SMPP_PORT}`))


setInterval(() => {
  LOG(rpc)
  rpc = 0
}, 1000)
