import { createClient } from 'redis'

const client = createClient()

client.on('error', (err) => console.log('Redis Client Error ', err))

let isConnected = false
async function redisConnect() {
  if (!isConnected) {
    console.log('redis connects')
    await client.connect()
    isConnected = true
  }

  return client
}

export default redisConnect
