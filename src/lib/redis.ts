import { createClient } from 'redis'

const publisher = createClient({})

export async function redisPublisherConnect() {
  if (!publisher.isOpen) await publisher.connect()
  return publisher
}

const subscriber = publisher.duplicate()

export async function redisSubscriberConnect() {
  if (!subscriber.isOpen) await subscriber.connect()
  return subscriber
}
