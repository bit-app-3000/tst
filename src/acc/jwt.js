

const request = require('superagent')
const admin = require('firebase-admin')


const firebase =  require('firebase/app')
require('firebase/auth')

const { log: LOG, error: ERR } = console
// const SA = require('../../keys/sa.json')
const SA = require('../../etc/keys/maap.json')
const { GoogleToken } = require('gtoken')

const guid = () =>
  [2, 1, 1, 1, 3].reduce((a, i, x) => {
    if (x) a += '-'
    while (i--) {
      a += Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return a
  }, '')

const config = {
  credential: admin.credential.cert(SA)
}



// const db = firebase.firestore()

// IS_DEV && db.settings({host: `${FIRE_HOST}:${FIRE_PORT}`, ssl: FIRE_SSL})




const app = firebase.initializeApp(config)
const auth = firebase.auth()

const uid = guid()

const additionalClaims = {
  aud: '/projects/158568169945/global/backendServices/6463741624071294655'
}
const url = `https://maap-20ufe6zd.ew.gateway.dev/echo?${uid}`

// const auth = admin.auth()

const email = 'b.tykhy@mmdsmart.com'
const password = '111111'
const key = SA.private_key

const OPTS = {
  scope: ['https://www.googleapis.com/auth/rcsbusinessmessaging'],
  expires: 14400
}

const getToken = async () => {


  const g = new GoogleToken({email, scope, key, additionalClaims})
  g.expiresAt = new Date().getTime() + OPTS.expires

  try {
    const t = await g.getToken()
    return {...t, expiresAt: g.expiresAt}
  } catch (e) {
    ERR(e)
    return {access_token: null, token_type: null, expiresAt: g.expiresAt}
  }
}

const run = async () => {
  LOG({ uid })
  const token = await auth.signInWithEmailAndPassword(email, password) //await getToken()
  LOG({ token })

  // const res = await request['post'](url).set({ Authorization: `Bearer ${token}` }).send({ uid })
  // LOG(res)

}

run().catch(ERR)

