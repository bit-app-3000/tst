const {SLAVE_PORT, SLAVE_HOST} = process.env
const {router, server} = require('./server')()
const {hostname} = require('os')
const {LOG, ERR} = require('./module')

function Handler(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({node: 'slave', hostname: hostname(), time: new Date}))
}

router.on('GET', '/', Handler)
server.listen(SLAVE_PORT, SLAVE_HOST, LOG(`slave: ${SLAVE_HOST}:${SLAVE_PORT}`))