const { Worker, isMainThread, parentPort } = require('worker_threads')
const { log: LOG, error: ERR } = console
const { serialize, deserialize } = require('v8')
const composeAsync = (...fns) => x => fns.reduceRight((f, g) => f.then(g), Promise.resolve(x))
const compose = (...fns) => x => fns.reduceRight((g, f) => f(g), x)

const { filter, until, zip, debounce, map, runEffects, fromPromise, chain, periodic, scan, throttle } = require('@most/core')
const { newDefaultScheduler } = require('@most/scheduler')
const { createAdapter } = require('@most/adapter')

const { request } = require('http')

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

const options = {
  host: 'localhost',
  port: 9393,
  // host: '44.in.ua',
  // port: 80,
  method: 'POST',
  path: '/fn-send',
  headers: {
    'Content-Type': 'application/json'
  }
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

const tasks = (bucket, length = 10) =>
  Array.from({ length }, (_, idx) => bucket.add(Buffer.from(JSON.stringify(Task(idx)))))  //setImmediate(() => )))

if (isMainThread) {
  
  LOG('This is the main thread')
  
  const workerInstance = (a, i) => {
    
    const WORKER_ID = guid()
    
    const w = new Worker(__filename, { env: { WORKER_ID } })
    
    w
      .on('message', done)
      .on('error', ERR)
      .on('exit', code => code && ERR(`Worker stopped with exit code ${code}`))
    
    a[WORKER_ID] = w
    
    return a
  }
  
  const s = {
    sendCount: 0,
    sendAll: 0,
    resCount: 0,
    resAll: 0
  }
  
  const [addTask, tasks$] = createAdapter()
  const [wrk, ready$] = createAdapter()
  const [stop, end$] = createAdapter()
  
  const scheduler = newDefaultScheduler()
  
  const bucket = new Set
  
  console.time('tasks')
  tasks(bucket, 5000)
  console.timeEnd('tasks')
  
  function done ({ WORKER_ID, data }) {
    
    ++s.resCount
    ++s[WORKER_ID].res
    
    wrk(WORKER_ID)
    
    setImmediate(add)
  }
  
  const add = () => {
    
    const { value, done } = bucket.values().next()
    if (value) {
      remove(value)
      return setImmediate(addTask, value)
    }
    
    setImmediate(stop, 'RUN')
    LOG('LAST STAT', s)
    
  }
  
  const send = (WORKER_ID, task) => {
    
    ++s.sendCount
    ++s.sendAll
    ++s.resAll
    
    ++s[WORKER_ID].send
    
    pool[WORKER_ID].postMessage({ task })
    
  }
  
  const remove = value => {
    return bucket.delete(value)
  }
  
  const stat = () => {
    LOG(s)
    s.sendCount = 0
    s.resCount = 0
  }
  
  const filterStop = e => {
    LOG('filterStop', e)
    return e === 'RUN'
  }
  
  const processing = () =>
    runEffects(until(filter(filterStop, end$), zip(send, ready$, tasks$)), scheduler)
  
  const statistic = () =>
    runEffects(until(filter(filterStop, end$), map(stat, periodic(1000))), scheduler)
  
  const pool = Array.from({ length: 10 }).reduce(workerInstance, {})
  
  const init = () => {
    statistic().catch(ERR)
    processing().catch(ERR)
    Object.keys(pool).forEach(i => {
      wrk(i)
      s[i] = { res: 0, send: 0 }
      add()
    })
  }
  init()
  
  //compose(add, statistic, processing)()
  
} else {
  
  const WORKER_ID = process.env.WORKER_ID
  const callBack = res =>
    res.on('data', data => parentPort.postMessage({ data: data.toString(), WORKER_ID }))
  
  const Req = ({ task }) => {
    const req = request(options, callBack)
    req.write(task)
    req.end()
  }
  
  parentPort.on('message', Req)
  
}




