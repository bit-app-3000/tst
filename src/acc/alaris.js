const { serialize, deserialize } = require('v8')
const { request } = require('http')
const { stringify } = require('querystring')

const { log: LOG, error: ERR } = console

const clone = obj => deserialize(serialize(obj))

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

const z = {
  
  acc_id: '577',
  
  username: 'postest1',
  password: 'dyhfdrmn',
  
  longMessageMode: 'cut',
  command: 'submit',
  
  uri: `${this.host}:${this.port}/${this.path}`,
  
  dnis: '38063384552',
  ani: '38063384552'
}
const { dnis, ani, username, password, longMessageMode, command } = z

const options = {
  host: '130.211.49.39',
  port: 8001,
  
  method: 'GET',
  path: '/api',
  // headers: {
  //   'Content-Type': 'application/json'
  //   // 'Prefer': 'resolution=merge-duplicates'
  // }
}

const callBack = done => res =>
  res
    .on('data', data => LOG(data.toString()))
    .on('end', done)

const payload = message => {
  
  return {
    id: guid(),
    dnis,
    ani,
    longMessageMode,
    command,
    username,
    password,
    message
  }
}

const send = message => {
  
  const query = stringify(payload(message))
  
  const opts = clone(options)
  opts.path += '?' + query
  
  return new Promise(done => {
    const req = request(opts, callBack(done))
    req.end()
  })
  
}

(async (exp) => {
  console.time('task')
  await send(exp).catch(ERR)
  console.timeEnd('task')
})(`http:test:maap ${Date.now()}`)

