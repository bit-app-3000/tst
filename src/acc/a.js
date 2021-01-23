const autocannon = require('autocannon')

const text = 'Hello, World!'

const opts = {
  url: 'http://44.in.ua/taskhandler',
  body: JSON.stringify({ text }),
  headers: { 'Content-Type': 'application/json'},
  method: 'POST',
  connections: 10,
  pipelining: 1,
  duration: 1
}

const instance = autocannon(opts)

process.once('SIGINT', () => {
  instance.stop()
})

autocannon.track(instance, {renderProgressBar: false})

// // results passed to the callback are the same as those emitted from the done events
// instance.on('done', handleResults)
//
// instance.on('tick', () => console.log('ticking'))
//
// instance.on('response', handleResponse)
//
// function handleResponse (client, statusCode, resBytes, responseTime) {
//   console.log(`Got response with code ${statusCode} in ${responseTime} milliseconds`)
// }
//
// function handleResults (result) {
//
// }
