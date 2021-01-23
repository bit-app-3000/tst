const { request } = require('http')
const { log: LOG, error: ERR } = console
// payload: { }
const val = idx => {
  return  {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'http://44.in.ua/taskhandler',
      body: { text: `Task text` },
      idx: `${idx}_${Date.now()}`
  }
}

const build = length =>
  Array.from({ length }, (i, idx) => JSON.stringify(val(idx))).join('\n')

const options = {
  host: 'localhost',
  port: 3000,
  method: 'POST',
  path: '/test_4',
  headers: {
    'Content-Type': 'text/csv',
    // 'Prefer': 'resolution=merge-duplicates'
  }
}

const callBack = done => res =>
  res
    .on('data', r => LOG(r.toString()))
    .on('end', done)




const postTasks = tasks => {
  return new Promise(done => {
    const req = request(options, callBack(done))
    req.write(tasks)
    req.end()
  })
}



(async (i) => {
  
  console.time('tasks')
  const q = 'payload\n' + build(100000)
  console.timeEnd('tasks')
  
  console.time('run')
  while (i--) {
    await postTasks(q).catch(ERR)
    LOG('END', i)
  }
  console.timeEnd('run')
  
})(1)
