import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'

async function verifyToken(token: string): Promise<string | null> {
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

export async function getUsername(token: string): Promise<string | null> {
  try {
    const res = await fetch(`${env.get('AUTH_SERVICE_URL')}api/v1/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const body = (await res.json()) as { data: { fullName: string } }
    return body.data.fullName
  } catch {
    console.log('Error fetching username')
    return null
  }
}

export default class VerifyTokenMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request } = ctx
    const token = request.header('authorization')?.replace('Bearer ', '')

    console.log('Token:', token)
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
