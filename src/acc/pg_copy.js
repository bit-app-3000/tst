const { Readable } = require('stream')
const { Pool } = require('pg')
const copyFrom = require('pg-copy-streams').from
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

const val = {
  httpRequest: {
    httpMethod: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    url: 'http://44.in.ua/taskhandler',
    body: { text: `Task text` }
  }
}

// const done = msg => LOG('DONE', msg)

const length = 10000
const json = val
const items = Array.from({ length }, (i, idx) => JSON.stringify(Object.assign({}, json, { idx })) + '\n')

const copyIn = () => {
  return new Promise(resolve => {
    
    pool.connect(function (err, client, done) {
      
      const read$ = Readable.from(items)
      const write$ = client.query(copyFrom('COPY test_4 (payload) FROM STDIN'))
      
      write$.on('error', err => {
          ERR('write$ error', err)
          resolve(done())
        })
      write$.on('finish', () => {
          LOG('write$  finish')
          resolve(done())
        })
      // write$.on('end', () => {
      //     LOG('write$  end')
      //     resolve(done(client.end()))
      //   })
      
      //.on('data', chunk => LOG(`write$ ${chunk}`))
      //.on('data', chunk => LOG(`read$ ${chunk}`))
      
      read$
        .on('error', err => {
          ERR('read$ error', err)
          resolve(done(client.end()))
        })
      
      read$.pipe(write$)
      
    })
  })
}

(async (i) => {
  
  console.time('copy')
  
  while (i--)
    await copyIn().catch(ERR)
  
  console.timeEnd('copy')
  
})(10)

// run: 8:27.383 (m:ss.mmm)
