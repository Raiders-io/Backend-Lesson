import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'
import { UserInfo } from '#types'

async function verifyToken(token: string): Promise<string | null> {
  console.log('Fetching username with token:', token)
  try {
    const res = await fetch(`${env.get('AUTH_SERVICE_URL')}/api/v1/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const body = (await res.json()) as { data: { userId: string } }
    return body.data.userId
  } catch (error) {
    console.log(`Error verifying token ${token}:`, error)
    return null
  }
}

export async function getUsername(token: string): Promise<UserInfo | null> {
  console.log('Fetching username with token:', token)
  try {
    const res = await fetch(`${env.get('AUTH_SERVICE_URL')}/api/v1/account/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const body = (await res.json()) as { data: { id: string; fullName: string; email: string } }
    console.log('Fetched user info:', body.data)
    body.data.fullName = body.data.fullName.replace(/\s+/g, '-') // Replace spaces with hyphens
    return new UserInfo({ id: body.data.id, username: body.data.fullName, email: body.data.email })
  } catch (error) {
    console.log('Error fetching username', error)
    return null
  }
}

export default class VerifyTokenMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request } = ctx
    const token = request.header('authorization')?.replace('Bearer ', '')

    try {
      if (!token) throw new Error('Missing token')
      const userId = await verifyToken(token)
      if (userId === null) throw new Error('Invalid token')
      ctx.userId = userId
    } catch {
      ctx.userId = undefined
    }

    return next()
  }
}
