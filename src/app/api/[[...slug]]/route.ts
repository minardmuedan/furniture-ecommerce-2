import { getCachedProducts } from '@/lib/cached-products'
import { categories, subcategories, type Categories, type Subcategories } from '@/lib/categories'
import { validateSession } from '@/lib/session'
import { notFound } from 'next/navigation'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params
  if (!slug) notFound()
  const route = slug.join('/')
  const { searchParams } = req.nextUrl

  if (route === 'auth') {
    const sessionData = await validateSession()
    if (!sessionData) return NextResponse.json(null)
    const { sessionId, user } = sessionData
    return NextResponse.json({ sessionId, user: { username: user.username, email: user.email } })
  }

  const page = Number(searchParams.get('page')) || 1

  if (route === 'products') {
    const categorySp = searchParams.get('category') as Categories
    const subcategorySp = searchParams.get('subcategory') as Subcategories

    const { products, totalProducts } = await getCachedProducts({
      page,
      category: categories[categorySp] ? categorySp : undefined,
      subcategory: subcategorySp || undefined,
    })
    return NextResponse.json({ data: products, totalData: totalProducts })
  }

  notFound()
}
