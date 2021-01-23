import https from 'https'
// import request  from 'superagent'

// request
//   .post('https://smsc.txtnation.com:5004/checkHLR')
//   .set('Content-Type', 'application/x-www-form-urlencoded')
//   .send(data)
//   .then(({text}) => {
//     LOG({text})
//   })



import tls from 'tls'
tls.DEFAULT_MIN_VERSION = 'TLSv1'

const { log: LOG, error: ERR } = console

const data = 'msisdn=380981306111&username=mmdsmart&password=3DNAje&output=json'

const options = {
  hostname: 'smsc.txtnation.com',
  port: 5004,
  path: '/checkHLR',
  method: 'POST',
  headers:{
    'Content-Type':'application/x-www-form-urlencoded'
  }
}

const req = https.request(options, (res) => {
  LOG('statusCode:', res.statusCode)
  res.on('data', r => LOG(r.toString()))
})


req.on('error', ERR)
req.write(data)
req.end()
