const { filter, until, debounce, map, runEffects, fromPromise, chain, periodic, scan } = require('@most/core')
const { newDefaultScheduler } = require('@most/scheduler')
const { createAdapter } = require('@most/adapter')

const { Pool } = require('pg')

const config = {
  user: 'postgres',
  host: '35.205.97.75',
  database: 'broadcasts',
  password: 'JBExpNDE4u12cxLb',
  port: 5432
  
}

const pool = new Pool(config)

const scheduler = newDefaultScheduler()
const { log: LOG, error: ERR } = console

const [addTask, tasks$] = createAdapter()
const [stop, end$] = createAdapter()

const bucket = new Set




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
  
  
  let query = 'INSERT INTO test (payload) VALUES '
  
  const json = JSON.stringify(val)
  
  const values = []
  
  let len = 2000
  
  while (len--)
    values.push(`('${json}')`)
  
  return query + values.join(',')
 
}

const tasks = (bucket, length) =>
  Array.from({ length }, (_, idx) => bucket.add(Task(idx)))  //setImmediate(() => )))

const send = () => {
  // LOG('send')
  const { value, done } = bucket.values().next()
  return value && addTask(value)
}

const remove = value => {
  bucket.delete(value)
}

const Commit = res => {
  LOG('Commit', Date.now())
  send()
}




const creatPromise = task =>{
  remove(task)
  return pool.query(task)
}



const start = rate => {
  stop('RUN')
  const commit$ = chain(fromPromise, map(creatPromise, debounce(rate, tasks$)))
  const r$ = map(Commit, commit$)
  const s$ = runEffects(until(filter(e => e === 'RUN', end$), r$), scheduler)
  send()
  return s$
}

const scale = rate => {
  
  rate = Math.round(rate / 2)
  
  LOG('scale', rate)
  
  start(rate)
    .then(() => LOG('then run', rate))
    .catch(ERR)
  
  return rate === 1 ? stop('SCALE') : rate
}

const scale$ = until(filter(e => e === 'SCALE', end$), scan(scale, 100, periodic(5000)))

// runEffects(scale$, scheduler)
//   .then(() => LOG('then scale'))
//   .catch(ERR)




console.time('tasks')
tasks(bucket, 100)
console.timeEnd('tasks')
LOG(bucket.size)

// let rate = 5
//
// start(rate)
//   .then(() => LOG('then run', rate))
//   .catch(ERR)
