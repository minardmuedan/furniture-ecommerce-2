'use server'

export const memaAction = async () => {
  const start = Date.now()

  await fetch(`http://localhost:3000/api/mema`)

  console.log('d: ', Date.now() - start, ' ms')
}
