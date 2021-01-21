import {resolve} from 'path'

export const
    ROOT = process.cwd(),
    DIST = resolve(ROOT, 'dist'),
    CERT = resolve(DIST, 'cert'),
    SERVICE = resolve(ROOT, 'services'),
    SHARED = resolve(SERVICE, 'shared'),
    SERVER = resolve(SERVICE, 'server'),
    CLIENT = resolve(SERVICE, 'client'),
    PROTO = resolve(SHARED, 'proto'),
    PIC = resolve(SERVER, 'a.jpg')