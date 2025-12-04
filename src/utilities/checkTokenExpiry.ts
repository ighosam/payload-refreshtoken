import type { CollectionBeforeOperationHook } from 'payload'
import {parse as parseCookies } from 'cookie'
import { isTokenExpired } from './isTokenExpired.js'

export const checkTokenExpiry: CollectionBeforeOperationHook = async ({ req }) => {
    // get token from header
  const authHeader = req.headers.get('authorization')?.replace('Bearer','')
//get token from httpOnly
  const rawCookieHeader = req.headers.get('cookie')
  const cookies = parseCookies(rawCookieHeader || '')
  const headerToken = cookies['payload-token']

//token either from header or from httpOnly cookie
const token = authHeader ? authHeader: headerToken
  if (!token) return

  const isExpired = await isTokenExpired(req,token)
  if (isExpired) {
    const error: any = new Error('Access token expiredded')
    error.status = 401
    error.data = { refresh: true }
    throw error
  }
  
}
