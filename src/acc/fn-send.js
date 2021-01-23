const { request } = require('http')

const options = {
  host: '44.in.ua',
  port: 80,
  method: 'POST',
  path: '/fn-send'
}

const chunk = res => data => res.status(200).send(data)
const callBack = res => x =>  x.on('data', chunk(res))
exports.send = (req, res) => request(options, callBack(res)).end()


