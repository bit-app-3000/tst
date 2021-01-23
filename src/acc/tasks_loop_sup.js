const request = require('superagent')

const { tap, filter, until, multicast, runEffects, periodic } = require('@most/core')
const { newDefaultScheduler } = require('@most/scheduler')
const { createAdapter } = require('@most/adapter')

const { log: LOG } = console
const compose = (...fns) => x => fns.reduceRight((g, f) => f(g), x)

const [stop, end$] = createAdapter()
const scheduler = newDefaultScheduler()

const bucket = new Set
const response = new Set

const size = 10015
const rate = 13
const limit = 1000 / rate

const task = idx => ({
  url: 'https://stage-hlr.mmdsmart.com/mockresponses/mitto2.json',
  method: 'get',
  query: {
    msisdn: '0505555555'
  },
  idx
})

const tasks = bucket => length =>
  Array.from({ length }, (i, idx) => bucket.add(task(idx)))

const stat = {
  
  send: {
    rpc: 0,
    all: 0
  },
  res: {
    rpc: 0,
    all: 0
  },
  
  inc_send: () =>
    setImmediate(() => {
      stat.send.all += 1
      stat.send.rpc += 1
    }),
  
  inc_res: () =>
    setImmediate(() => {
      stat.res.all += 1
      stat.res.rpc += 1
    }),
  
  log: () =>
    setImmediate(() => {
      
      LOG({
        p: { target: bucket.size, done: response.size, rate },
        s: stat.send,
        r: stat.res
      })
      
      stat.send.rpc = 0
      stat.res.rpc = 0
    })
}

const req = ({ method, url, query }) =>
  request[method](url)
    .query(query)
    .then(done)
    .catch(done)

const done = data => {
  stat.inc_res() && response.add(data)
  response.size === size && stat.log()
}

const send = () => {
  const { value, done } = bucket.values().next()
  return done
    ? stop('RUN')
    : stat.inc_send() && bucket.delete(value) && req(value)
}

const e$ = multicast(filter(e => e === 'RUN', end$))

const p$ = until(e$, tap(send, periodic(limit)))
const s$ = until(e$, tap(stat.log, periodic(1000)))

const processing = () => runEffects(p$, scheduler)
const statistic = () => runEffects(s$, scheduler)

compose(processing, statistic, tasks(bucket))(size)
