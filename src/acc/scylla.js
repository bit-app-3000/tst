const { Client } =require('cassandra-driver')

const cid = 'test_2'
const { log: LOG, error: ERR } = console
const guid = () => [2, 1, 1, 1, 3].map(length => Array.from({length}, () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)).join('')).join('-')

const config = {
  contactPoints: ['h1'],
  localDataCenter: 'datacenter1',
  keyspace: 'ks1'
}

const client =  new Client(config)



const close = async (fastify, done) => await client.shutdown(done)

const query = async (query, params = [], opts = {}) => {
  const res = await client.execute(query, params, opts).catch(ERR('scylla'))
  return res.rows
}


const val = idx => {
  return {
    _id: guid(),
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

const build = length => {
  return Array.from({ length }, (i, idx) => {
    return { insertOne: { document: val(idx) } }
  })
}

const set = async data => {
  
  const client = await client.connect()
  
  return  client.execute(query, params, opts)
  
}

(async (i) => {
  
  console.time('tasks')
  const q = build(100)
  console.timeEnd('tasks')
  
  console.time('run')
  while (i--) {
    
    await set(q).catch(ERR)
    
    LOG('END', i)
  }
  
  console.timeEnd('run')
  
})(1)
