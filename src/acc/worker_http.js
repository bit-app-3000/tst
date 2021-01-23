const { request } = require('http')

const options = {
  host: '44.in.ua',
  port: 80,
  method: 'POST',
  path: '/fn-send',
  headers: {
    'Content-Type': 'application/json'
  }
}

const callBack = done => res => {
  LOG('emit')
  res.on('data', data => done(JSON.parse(data.toString())))
}

const Req = task => done => {
  const req = request(options, done)
  req.write(task)
  req.end(remove(task))
}

const creatPromise = task =>  new Promise(Req(task))
