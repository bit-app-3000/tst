const { Pool } = require('pg')

const { log: LOG, error: ERR } = console

// const config = {
//   user: 'postgres',
//   host: '35.205.97.75',
//   database: 'broadcasts',
//   password: 'JBExpNDE4u12cxLb',
//   port: 5432
// }
const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'svc_broadcast',
  password: '1515',
  port: 5432
}


const pool = new Pool(config)

const val = idx => {
  return {
    payload: {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'http://44.in.ua/taskhandler',
      body: { text: `Task text` },
      idx: `${idx}_${Date.now()}`
    }
  }
}

const run =  q => {
  return  pool.query(q)
}

const build = length => {
  let query = 'INSERT INTO test (payload) VALUES '

  const values = Array.from({ length }, (i, idx) => `('${ JSON.stringify(val(idx))}')`)
  return query + values.join(',')
}

(async (i) => {
  
  console.time('tasks')
  const q = build(10000)
  console.timeEnd('tasks')
  
  console.time('run')
  while (i--) {
    
    await run(q).catch(ERR)
    
    LOG('END', i)
  }
  console.timeEnd('run')
  

  
})(10)
