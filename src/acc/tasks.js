const { resolve } = require('path')
const { CloudTasksClient } = require('@google-cloud/tasks')
const { filter, map, runEffects, fromPromise, scan, since, chain, until, at, periodic, awaitPromises, tap, never, withItems, empty } = require('@most/core')
const { newDefaultScheduler } = require('@most/scheduler')

const scheduler = newDefaultScheduler()

const { log: LOG, error: ERR } = console

const { createHook } = require('async_hooks')



const projectId = 'maap-test-292714'
const keyFilename = resolve(process.cwd(), 'keys', 'maap-test-292714.json')
const client = new CloudTasksClient({ keyFilename })

const project = projectId
const queue = 'test'
const location = 'europe-west2'
const url = 'http://44.in.ua/taskhandler' // 'https://europe-west1-maap-test-292714.cloudfunctions.net/send'

const inSeconds = 1

const parent = client.queuePath(project, location, queue)
const text = 'Hello, World!'

function Task (idx) {
  const task = {
    httpRequest: {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url
    }
  }
  
  task.httpRequest.body = Buffer.from(JSON.stringify({ text, idx })).toString('base64')
  
  return delay
  
  // return await client.createTask({ parent, task })
  
}

const Tasks = (length = 5) =>
  Array.from({ length }, (i, idx) => Task(idx))

// const Segment = async len =>
//   await Promise.all(Tasks(len)).catch(ERR)

// const Run = async () => {
//   await Segment(500)
//   LOG('RUN')
// }

// const run$ = map(fromPromise(Task), until(at(10000, null), periodic(1000)))



// const items = Tasks()

/*
const $ = never()
// const tasks$ = withItems(items, $)


const delay = (ms=100)  => new Promise(r => setTimeout(() => r(ms), ms))

const p$ = fromPromise(delay(100)) //map(delay, never())

*/


const Commit = res => {
  LOG('Commit', res)
}

const t$ = withItems(['11'], empty())

const run$ = map(Commit, t$)
runEffects(run$, scheduler).catch(ERR)

// const create$ = awaitPromises(tasks$)



/*(async (length) => {
  while (length--)
    await  Run().catch(NO_OP)
})(1)*/
