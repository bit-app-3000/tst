import {credentials} from '@grpc/grpc-js'


import {ERR, LOG, loadProto} from './module'
import {SERVER_HOST, SERVER_PORT, PROTO, CERT} from './config'
import {readFileSync} from "fs";
import {resolve} from "path";


const proto = loadProto('test')
const root = readFileSync(resolve(CERT, 'RootCa.crt'))
const key = readFileSync(resolve(CERT, 'dev.key'))
const cert = readFileSync(resolve(CERT, 'dev.crt'))

const BIND_ADDRESS = `localhost:${SERVER_PORT}`//`${SERVER_HOST}:${SERVER_PORT}`
const CREDENTIALS = credentials.createSsl(root, key, cert)

const log = lbl => data => LOG(lbl, data)
const err = lbl => data => ERR(lbl, data)


function Unary1() {

    setInterval(() => {
        const unary = new proto.test.Unary(BIND_ADDRESS, CREDENTIALS)
        unary.Get1(null, (err, res) =>
            err ? ERR('Unary1 error:', err)
                : null // LOG('Unary1 res:', res)
        )
    }, 10)

}

function Unary2() {

    const unary = new proto.test.Unary(BIND_ADDRESS, CREDENTIALS)
    unary.Get2(null, (err, res) =>
        err ? ERR('Unary2 error:', err)
            : LOG('Unary2 res:', res)
    )
}

function Stream() {

    const stream = new proto.test.Stream(BIND_ADDRESS, CREDENTIALS)

    const $ = stream.Stream(null, (err, res) =>
        err
            ? ERR('Stream error:', err)
            : LOG('Stream res:', res)
    )

    $.once('metadata', log('Stream metadata'))
    $.once('status', log('Stream status'))
    $.on('error', err('Stream error'))
    $.on('data', log('Stream data'))
}

function DuplexStream(params) {

    const duplex = new proto.test.DuplexStream(BIND_ADDRESS, CREDENTIALS)
    const $ = duplex.DuplexStream(params, (err, res) =>
        err
            ? ERR('DuplexStream err:', err)
            : LOG('DuplexStream res:', res)
    )

    $.once('metadata', log('DuplexStream metadata'))
    $.once('status', log('DuplexStream status'))
    $.on('error', err('DuplexStream error'))
    $.on('data', log('DuplexStream data'))

    setInterval(() => {
        const res = {a: Math.random()}
        LOG('DuplexStream write', res)
        $.write(res)
    }, 10)

}


const run = k => {
    switch (k) {
        case 1:
            return Unary1()
        case 2:
            return Unary2()
        case 3:
            return Stream()
        case 4:
            return DuplexStream()
    }
}

run(parseInt(process.argv[2]))
