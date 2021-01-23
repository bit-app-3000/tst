// const { request } = require('https')
const request = require('superagent')
const { serialize, deserialize } = require('v8')

const { filter, until, multicast, awaitPromises, zip, debounce, map, runEffects, fromPromise, chain, periodic, scan, throttle } = require('@most/core')
const { newDefaultScheduler } = require('@most/scheduler')
const { createAdapter } = require('@most/adapter')

const composeAsync = (...fns) => x => fns.reduceRight((f, g) => f.then(g), Promise.resolve(x))
const compose = (...fns) => x => fns.reduceRight((g, f) => f(g), x)

const { log: LOG, error: ERR } = console

const options = {
  host: 'google.com',
  // port: 80,
  // host: 'localhost',
  // port: 9393,
//   method: 'POST',
  // path: '/fn-send',
  // headers: {
  //   'content-type': 'application/json'
  // }
}

const Task = idx => {
  return {
    httpRequest: {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'http://44.in.ua/taskhandler',
      body: Buffer.from(JSON.stringify({ text: `Task text`, idx })),
      idx
    }
  }
}

const tasks = bucket => length => {
  console.time('tasks')
  Array.from({ length }, (_, idx) => bucket.add(Buffer.from(JSON.stringify(Task(idx)))))
  console.timeEnd('tasks')
}

const s = {
  send: {
    rpc: 0,
    all: 0
  },
  res: {
    rpc: 0,
    all: 0
  }
}

const [addTask, tasks$] = createAdapter()
const [stop, end$] = createAdapter()
const scheduler = newDefaultScheduler()

const bucket = new Set


const done = () => {
  
  ++s.res.all
  ++s.res.rpc
  setImmediate(add)
  
}

const add = () => {
  
  const { value } = bucket.values().next()
  
  if (!value) {
    stop('RUN')
    return stat()
    
  } else {
    bucket.delete(value)
    setImmediate(addTask, value)
  }
  
}

const send = task => {
  
  ++s.send.all
  ++s.send.rpc
  
  Req(task)
  
}

const callBack = res => res.on('data', LOG)

const Req = task => {
  // const req = request(options)
  // req.write(task)
  // req.end(done)
  
  request
    .get('https://stage-hlr.mmdsmart.com/mockresponses/mitto2.json')
    .then(done)
    .catch(ERR)
  
}

const stat = (last = false) => {
  LOG(s)
  s.send.rpc = 0
  s.res.rpc = 0
}

const filterStop = e => e === 'RUN'

const e$ = multicast(filter(filterStop, end$))

// const t$ =  debounce(1,  tasks$)

const processing = () =>
  runEffects(until(e$, map(send, tasks$)), scheduler)

const statistic = () =>
  runEffects(until(e$, map(stat, periodic(1000))), scheduler)

compose(add, processing, statistic, tasks(bucket))(100)
