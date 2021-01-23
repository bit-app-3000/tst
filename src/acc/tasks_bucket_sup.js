const request = require('superagent')

const { delay, filter, until, multicast, map, runEffects, periodic } = require('@most/core')
const { newDefaultScheduler } = require('@most/scheduler')
const { createAdapter } = require('@most/adapter')

const { log: LOG, error: ERR } = console
const compose = (...fns) => x => fns.reduceRight((g, f) => f(g), x)

const tasks = bucket => length => {
  console.time('tasks')
  Array.from({ length }, () => bucket.add(Buffer.from(JSON.stringify({ msisdn: '0505555555' }))))
  console.timeEnd('tasks')
}

const [stop, end$] = createAdapter()
const scheduler = newDefaultScheduler()

const bucket = new Set

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
const sendEnc = () => {
  ++s.send.all
  ++s.send.rpc
}
const resEnc = () => {
  ++s.res.all
  ++s.res.rpc
}


const req = task =>
  request
    .get('stage-hlr.mmdsmart.com/mockresponses/mitto2.json')
    .query(task)
    .then(done)
    .catch(ERR)

const done = compose(resEnc)
const remove = v => (bucket.delete(v), v)
const send = () => {
  const { value } = bucket.values().next()
  return value
    ? compose(sendEnc, req, remove)(value)
    : stop('RUN')
  
}

const stat = () => {
  LOG(s)
  s.send.rpc = 0
  s.res.rpc = 0
}

const filterStop = e => e === 'RUN'

const limit = 1000 / 100

const e$ = multicast(filter(filterStop, end$))

const p$ = until(e$, map(send, periodic(limit)))
const s$ = until(e$, map(stat, periodic(1000)))

const processing = () => runEffects(p$, scheduler)
const statistic = () => runEffects(s$, scheduler)

try {
  
  compose(processing, statistic, tasks(bucket))(1000)
  
} catch (e) {
  
  ERR(e)
}
