import isUUID from 'validator/es/lib/isUUID'
import isURL from 'validator/es/lib/isURL'
import isMobilePhone from 'validator/es/lib/isMobilePhone'
import isEmail from 'validator/es/lib/isEmail'
import isJSON from 'validator/es/lib/isJSON'
import isDate from 'date-fns/isDate'

import { compose, either, store } from './'
import { LOKI_ID } from '../configs'

// received |> parse |> permissions |> sanitize |> set
// get |> permissions |> serialize |> sent

const error = message => {
  const error = new Error(message)
  error.name = 'SchemaParseError'
  throw error
}

const success = () => false

const lexeme = str => ({ k, v }) => `${k} > ${v} ${str}`
const message = {
  UUID: lexeme('is not UUID'),
  NULL: lexeme('must be null'),
  BOOLEAN: lexeme('must be boolean'),
  CONSTANT: lexeme('not valid constant'),

  NUMBER: lexeme('must be Number'),

  SCHEMA: lexeme('must be JSON object'),
  OBJECT: lexeme('must be JSON object'),

  ENUM: lexeme('not exits in DataSet'),
  ARRAY: lexeme('must be array'),

  TIMESTAMP: lexeme(' is note Date'),

  URI: lexeme('must be URL'),
  PHONE: lexeme(' must tel standard'),
  EMAIL: lexeme(' must be email'),
  TEXT: lexeme(' must be text'),
  PASSWORD: lexeme(' err password')
}

const condition = {
  UUID: ({ v }) => isUUID(v),
  NULL: ({ v }) => v === null,
  BOOLEAN: ({ v }) => typeof v === 'boolean',
  CONSTANT: ({ v, value }) => v === value,

  NUMBER: ({ v }) => typeof v === 'number',
  STRING: ({ v }) => typeof v === 'string',

  SCHEMA: ({ v }) => isJSON(String(v)),
  OBJECT: ({ v }) => typeof v === 'object',
  ARRAY: ({ v }) => Array.isArray(v),
  ENUM: ({ v, datalist }) => datalist.includes(v),

  TIMESTAMP: ({ v }) => isDate(new Date(v)),

  URI: ({ v }) =>
    isURL(String(v), {
      require_host: 0,
      require_valid_protocol: 0,
      allow_protocol_relative_urls: 1
    }),
  PHONE: ({ v }) => isMobilePhone(String(v)),
  EMAIL: ({ v }) => isEmail(String(v)),
  PASSWORD: ({ v }) => typeof v === 'string',
  TEXT: ({ v }) => typeof v === 'string'
}

const check = type => either(condition[type], success, compose(error, message[type]))
const schema = sid => store.get({ cid: '$$' }).by(LOKI_ID, sid) || error(`${sid} > fields does not pass`)
const key = (namespace, id) => `${namespace}:${id}`
const chk = data => ctx => {
  const { type, namespace, rel, v } = ctx

  switch (type) {
    case 'SCHEMA':
      return parse(v)(schema(key(namespace, data[rel] ? data[rel] : v.type)))
    case 'OBJECT':
      return parse(v)(ctx)
    default:
      return check(type)(ctx)
  }
}

const parse = data => ({ fields }) => {
  const c = chk(data)

  return Object.entries(data).reduce((a, [k, v]) => {
    !fields[k] && error(`${k} > is not allow`)

    const ctx = fields[k]
    const d = Object.assign(ctx, { k, v })

    a[k] = v ? c(d) : ['NUMBER', 'BOOLEAN'].includes(k) && c(d)

    return a
  }, {})
}

const parser = (sid, data) => {
  try {
    compose(parse(data), schema)(sid)
  } catch (e) {
    return e
  }
}

export { parser }
