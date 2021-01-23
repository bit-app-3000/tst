const { Worker, isMainThread, parentPort } = require('worker_threads')
const { log: LOG, error: ERR } = console

const { serialize, deserialize } = require('v8')
const composeAsync = (...fns) => x => fns.reduceRight((f, g) => f.then(g), Promise.resolve(x))
const compose = (...fns) => x => fns.reduceRight((g, f) => f(g), x)

const { multicast, filter, until, zip, debounce, map, runEffects, fromPromise, chain, periodic, scan, throttle } = require('@most/core')
const { newDefaultScheduler } = require('@most/scheduler')
const { createAdapter } = require('@most/adapter')

const { request } = require('https')

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
  host: 'stage-hlr.mmdsmart.com',
  //port: 443,
  // host: 'localhost',
  // port: 9393,
  // method: 'GET',
   path: '/minio/mockresponses/mitto2.json',
  // headers: {
  //   'Content-Type': 'application/json'
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
  
  let s = {}
  
  const [addTask, tasks$] = createAdapter()
  const [wrk, ready$] = createAdapter()
  const [stop, end$] = createAdapter()
  
  const scheduler = newDefaultScheduler()
  
  const bucket = new Set
  
  function done ({ WORKER_ID, data }) {
    
    // LOG({data})
    
    ++s.res.all
    ++s.res.rpc
    
    ++s[WORKER_ID].res.all
    ++s[WORKER_ID].res.rpc
    
    wrk(WORKER_ID)
    
    setImmediate(add)
  }
  
  const add = () => {
    
    const { value } = bucket.values().next()
    
    if (!value) {
      setImmediate(stop, 'RUN')
      stat()
      return
      
    } else {
      bucket.delete(value)
      setImmediate(addTask, value)
      
    }
    
  }
  
  const send = (WORKER_ID, task) => {
    
    ++s.send.all
    ++s.send.rpc
    
    ++s[WORKER_ID].send.all
    ++s[WORKER_ID].send.rpc
    
    pool[WORKER_ID].postMessage({ task })
    
  }
  
  const stat = () => {
    LOG(s)
    s.send.rpc = 0
    s.res.rpc = 0
    Object.keys(pool).forEach(i => {
      s[i].send.rpc = 0
      s[i].res.rpc = 0
    })
    
  }
  
  const filterStop = e => e === 'RUN'
  
  const e$ = multicast(filter(filterStop, end$))
  
  const processing = () =>
    runEffects(until(e$, zip(send, ready$, tasks$)), scheduler)
  
  const statistic = () =>
    runEffects(until(e$, map(stat, periodic(1000))), scheduler)
  
  const pool = Array.from({ length: 4 }).reduce(workerInstance, {})
  
  const init = () => {
    
    console.time('tasks')
    tasks(bucket, 5000)
    console.timeEnd('tasks')
    
    statistic().catch(ERR)
    processing().catch(ERR)
    
    s = {
      send: {
        rpc: 0,
        all: 0
      },
      res: {
        rpc: 0,
        all: 0
      }
      
    }
    
    Object.keys(pool).forEach(i => {
      wrk(i)
      s[i] = {
        send: {
          rpc: 0,
          all: 0
        },
        res: {
          rpc: 0,
          all: 0
        }
      }
    })
    
    add()
  }
  init()
  
  //compose(add, statistic, processing)()
  
} else {
  
  const WORKER_ID = process.env.WORKER_ID
  
  const callBack = res => {
    res.on('data', chunk => {
   
    })
    res.on('end', () => {
      done()
    })
  }

  
  const done = () => parentPort.postMessage({ WORKER_ID })
  
  const Req = ({ task }) => {
    const req = request(options, callBack)
    //req.write(task)
    req.end()
  }
  
  parentPort.on('message', Req)
}
