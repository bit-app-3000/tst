import {request} from "http";

const {API_PORT, API_HOST, SLAVE_HOST, SLAVE_PORT} = process.env
const {router, server} = require('./server')()
const {hostname} = require('os')
const {LOG, ERR} = require('./module')
const {get} = require('http')


const opts = {
    hostname: '127.0.0.1',//SLAVE_HOST,
    port: 9595, //SLAVE_PORT,
    path: '/',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }

}

const $r = () => new Promise(resolve => {

    const req = request(opts, r => {
        let body = ''
        r.setEncoding('utf8')
        r.on('data', chunk => body += chunk)
        r.on('end', () => resolve(body))
    })

    req.on('error', e => ERR(`problem with request: ${e.message}`))
    req.end()

})

const {SLAVE_URL} = process.env

async function Handler(req, res) {

    const r = await $r().catch(ERR)

    //const json = JSON.stringify({test: new Date, hostname: hostname(), mrfca: new Date})
    const data = JSON.stringify({SLAVE_URL})
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(r)
}


const str = 'loaderio-968cae87e535128c3736aa0547491128'

function HandlerLoaderIo(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(str)
}

router.on('GET', '/loaderio-968cae87e535128c3736aa0547491128.html', HandlerLoaderIo)
router.on('GET', '/', Handler)

server.listen(API_PORT, API_HOST, LOG(`api: ${API_HOST}:${API_PORT}`))
LOG({SLAVE_URL})

/*
const dns= require('dns')


dns.resolveSrv('api', (err,res) => {
    err
        ? ERR(err)
        : LOG(res)
})*/
