const { PubSub } = require('@google-cloud/pubsub')
const { resolve } = require('path')
const { map, filter, until, multicast, runEffects, periodic } = require('@most/core')
const { newDefaultScheduler } = require('@most/scheduler')
const { createAdapter } = require('@most/adapter')

const { log: LOG, error: ERR } = console
const compose = (...fns) => x => fns.reduceRight((g, f) => f(g), x)
const keyFilename = resolve('../../', 'keys', 'maap-test-292714.json')

const projectId = 'maap-test-292714'
const topicName = 'lil-tst'
const subscriptionName = 'lil-tst-sub'

const bucket = new Set

const handler = msg => {
 // LOG('Received message:', msg.data.toString())
  bucket.add(msg)
  LOG(bucket.size)
  // msg.ack()
}


const error = err => ERR('Received error:', err)

const pubSub = new PubSub({ keyFilename })

const topic = pubSub.topic(topicName)
const sub =  topic.subscription(subscriptionName)

sub.on('message', handler)
sub.on('error', error)


async function pub() {
  const msg =`Test message! ${Date.now()}`
  await topic.publish(Buffer.from(msg ))
}

 //runEffects(map(pub, periodic(1000)), newDefaultScheduler()).catch(ERR)



process.on('unhandledRejection', ({message}) => {
  ERR(message)
  process.exitCode = 1
})
