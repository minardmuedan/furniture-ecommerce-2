export default function Homepage() {
  const ewan = new URL('http://localhost:3000/api/route?ewan=2')
  ewan.searchParams.set('ewans', 'inamers')

  return <pre>{JSON.stringify({ ewan: ewan.pathname })}</pre>
}
