import { resolve } from 'path'

export const ROOT = process.cwd()
export const DIST = resolve(ROOT, 'dist')


export const ASSETS = resolve(DIST, 'assets')
export const JS = resolve(ASSETS, 'js')
export const WS = resolve(JS, 'ws.js')

export const EXCLUDE = resolve(ROOT, 'node_modules')

export const DLL = resolve(ASSETS, 'dll', '[name].json')
export const VENDOR = resolve(ASSETS, 'dll', 'vendor.json')

export const SRC = resolve(ROOT, 'src')
export const SHARED = resolve(SRC, 'shared')

export const CLIENT = resolve(SRC, 'client')
export const STYLE = resolve(SRC, 'style')

export const STATIC = resolve(SRC, 'static')
export const IMG = resolve(STATIC, 'img')
export const SVG = resolve(STATIC, 'svg')

export const VIEWS = resolve(SRC, 'views')
export const DEV_VIEW = resolve(VIEWS, 'dev.pug')
export const BASE_VIEW = resolve(VIEWS, 'base.pug')

export const AVA = resolve(STATIC, 'ava')
export const FAV_ICO = resolve(AVA, 'logo.png')
