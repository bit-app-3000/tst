const { awaitPromises, throttle, debounce, switchLatest, map, runEffects, fromPromise, chain } = require('@most/core')
const { newDefaultScheduler } = require('@most/scheduler')
const { createAdapter } = require('@most/adapter')

const { Pool, Client } = require('pg')

const pool = new Pool(config)

const config = {
  user: 'postgres',
  host: '35.205.97.75',
  database: 'broadcasts',
  password: 'JBExpNDE4u12cxLb',
  port: 5432
  
}

const { request } = require('http')

const { log: LOG, error: ERR } = console

const Task = idx => {
  
  const payload = { text: `Task text`, idx }
  
  const val = {
    httpRequest: {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'http://44.in.ua/taskhandler',
      body: Buffer.from(JSON.stringify(payload)),
      idx
    }
  }
  
  return {
    text: `INSERT INTO test(payload) VALUES($1) RETURNING *`,
    values: [val]
  }
  
}

const Commit = res => {
  LOG('Commit', res)
}

const [addTask, tasks$] = createAdapter()

const createTasks = (length = 10) =>
  Array.from({ length }, (_, idx) => addTask(Task(idx)))

const options = {
  host: '44.in.ua',
  port: 80,
  method: 'POST',
  path: '/fn-send',
  headers: {
    'Content-Type': 'application/json'
  }
}
/*

// const chunk = data => data
const callBack = done => res => res.on('data', data => done(JSON.parse(data.toString())))
const creatPromise = task =>
  new Promise(done => {
    const data = Buffer.from(JSON.stringify(task))
    const req = request(options, callBack(done))
    req.write(data)
    req.end()
  })
*/



const creatPromise = task =>
  pool.query(task)



let rate = 20

const t$ = throttle(rate, map(creatPromise,  tasks$))
const p$ = chain(fromPromise, t$)
// const p$ = awaitPromises(t$)
const run$ = map(Commit, p$)
// const commit$ = map(Commit, run$)

runEffects(run$, newDefaultScheduler()).catch(ERR)

createTasks(100)



// const t$ = awaitPromises(map(delay, events))
// const t$ = chain(fromPromise, tasks$)

/*const rndInt = (min, max) => Math.floor(min + Math.random() * (max + 1 - min))

const Run = async (seg, len) => {
  while (len--) {
    const ms = rndInt(1, 50) * 100
    const res = await Task(ms, seg, len)
    Commit(res)
  }
}

(async (i) => {
  while (i--) {
    await Run(i, 5).catch(ERR)
    LOG('END', i)
  }
})(4)*/



