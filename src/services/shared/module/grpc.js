import {resolve} from 'path'

import {loadPackageDefinition} from '@grpc/grpc-js'
import {loadSync} from '@grpc/proto-loader'

import {PROTO} from '../config'

const opts = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
}

const loadProto = file =>
    loadPackageDefinition(loadSync(resolve(PROTO, `${file}.proto`), opts))

export {loadProto}