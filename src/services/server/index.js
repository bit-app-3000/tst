import {readFileSync} from 'fs'
import {request} from 'http'


import {resolve} from 'path'
import {Server, ServerCredentials} from '@grpc/grpc-js'

import {PIC, SERVER_HOST, SERVER_PORT, CERT} from './config'
import {LOG, ERR, loadProto} from './module'


const proto = loadProto('test')
const pic = readFileSync(PIC)

const log = lbl => data => LOG(lbl, data)
const err = lbl => data => ERR(lbl, data)


const opts = {
    hostname: 'localhost',
    port: 3000,
    path: '/message',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }

}


function Get1(call, cb) {
    // LOG('Get1 req', call.request)
    const res = {a: Math.random(), b: pic}
    // LOG('Get1 res', res)

    const data = JSON.stringify({body: 'Hello World!'})
    // LOG({data})

    Object.assign(opts.headers, {'Content-Length': Buffer.byteLength(data)})


    const req = request(opts, r => {
        LOG(`STATUS: ${r.statusCode}`)
       // console.log(`HEADERS: ${JSON.stringify(r.headers)}`)
        r.setEncoding('utf8')
        cb(null, res)
    })

    req.on('error', (e) => {
        ERR(`problem with request: ${e.message}`)
    })
    req.write(data)
    req.end()

}

function Get2(call, cb) {
    LOG('Get2 req', call.request)
    const res = {a: Math.random(), b: pic}
    LOG('Get2 res', res)

    const data = JSON.stringify({body: 'Hello World!'})
    LOG({data})

    Object.assign(opts.headers, {'Content-Length': Buffer.byteLength(data)})


    const req = request(opts, r => {
        console.log(`STATUS: ${r.statusCode}`)
        console.log(`HEADERS: ${JSON.stringify(r.headers)}`)
        r.setEncoding('utf8')
        r.on('data', (chunk) => {
            LOG(`BODY: ${chunk}`);
        })
        r.on('end', () => {
            LOG('No more data in response.');
        })
        cb(null, res)
    })

    req.on('error', (e) => {
        ERR(`problem with request: ${e.message}`)
    })
    req.write(data)
    req.end()
}

function Stream(call) {

    LOG('Stream req', call.request)

    const id = setInterval(() => {

        const res = {a: Math.random(), b: pic}

        call.write(res, err => {
            err
                ? ERR('Stream err', err)
                : LOG('Stream write', res)
        })

    }, 5)

    call.on('error', err => {
        ERR('Stream err', err)
        clearInterval(id)
    })
}

function DuplexStream(call) {

    const id = setInterval(() => {
        const res = {a: Math.random(), b: pic}

        call.write(res, err =>
            err ? ERR('DuplexStream err', err)
                : LOG('DuplexStream write', res)
        )

    }, 5)

    call.on('error', err('on DuplexStream error'))
    call.on('data', log('on DuplexStream data'))

    call.on('end', () => {
        LOG('on DuplexStream end')
        clearInterval(id)
        call.end()
    })


}

const SERVER_BIND = `${SERVER_HOST}:${SERVER_PORT}`
const server = new Server


const getService = name => service =>
    proto[name][service].service

const addService = (service, obj) =>
    server.addService(service, obj)


const s = getService('test')

addService(s('Unary'), {Get1, Get2})
addService(s('Stream'), {Stream})
addService(s('DuplexStream'), {DuplexStream})


/*const root = readFileSync(resolve(CERT, 'RootCa.crt'))
const private_key = readFileSync(resolve(CERT, 'dev.key'))
const cert_chain = readFileSync(resolve(CERT, 'dev.crt'))
const keys = [{private_key, cert_chain}]


const Credentials = ServerCredentials.createSsl(root, keys, true)*/

const Credentials = ServerCredentials.createInsecure()



server.bindAsync(SERVER_BIND, Credentials, err => {

    err
        ? ERR(`grpc server is error ${err}`)
        : (server.start(), LOG(`grpc server is listening ${SERVER_BIND}`))

})


/*
const insecureCredentials = ServerCredentials.createInsecure()


server.bindAsync(SERVER_BIND, insecureCredentials, err => {

    err
        ? ERR(`grpc server is error ${err}`)
        : (server.start(), LOG(`grpc server is listening ${SERVER_BIND}`))

})
*/
