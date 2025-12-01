import { NextResponse } from 'next/server'

export function GET() {
  console.log('hello from api')
  return NextResponse.json({ hello: 'world' })
}
