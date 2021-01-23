const { MongoClient } = require('mongodb')

const MONGO_DB = 'broadcasts'
const MONGO_USER = 'user'
const MONGO_PASS = '1515'
const MONGO_HOST = 'localhost'
const MONGO_PORT = 27017

const cid = 'test_2'

const uri = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}`
const { log: LOG, error: ERR } = console

const connect = async () => {
  
  const client = new MongoClient(uri)
  
  try {
    
    return await client.connect()
    
  } catch (e) {
    ERR(e)
    throw e
  }
  
}
const guid = () => [2, 1, 1, 1, 3].map(length => Array.from({length}, () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)).join('')).join('-')
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
  
  const client = await connect()
  const coll = client.db(MONGO_DB).collection(cid)
  
  // LOG({data})
  
  await coll.bulkWrite(data)
  await client.close()
}

(async (i) => {
  
  console.time('tasks')
  const q = build(10000)
  console.timeEnd('tasks')
  
  console.time('run')
  while (i--) {
    
    await set(q).catch(ERR)
    
    LOG('END', i)
  }
  
  console.timeEnd('run')
  
})(1)
