const { request } = require('http')
const { log: LOG, error: ERR } = console

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

const build = length =>
  Array.from({ length }, (i, idx) => val(idx))

const options = {
  host: 'localhost',
  port: 3000,
  method: 'POST',
  path: '/test_4',
  headers: {
    'Content-Type': 'application/json',
    // 'Prefer': 'resolution=merge-duplicates'
  }
}

const callBack = done => res =>
  res
    .on('data',LOG)
    .on('end', done)




const postTasks = task => {
  return new Promise(done => {
    const req = request(options, callBack(done))
    req.write(task)
    req.end()
  })
}



(async (i) => {
  
  console.time('tasks')
  const q = JSON.stringify(build(10000))
  console.timeEnd('tasks')
  
  console.time('run')
  
  while (i--) {
    await postTasks(q).catch(ERR)
    LOG('END', i)
  }
  console.timeEnd('run')
  
})(10)
