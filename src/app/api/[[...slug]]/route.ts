import { getProductsDb } from '@/db/utils/products'
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
    ;(res) => setTimeout(res, 5000)
    const sessionData = await validateSession()
    if (!sessionData) return NextResponse.json(null)
    const { sessionId, user } = sessionData
    return NextResponse.json({ sessionId, user: { username: user.username, email: user.email } })
  }

  const page = Number(searchParams.get('page')) || 1

  if (route === 'products') {
    const category = searchParams.get('category') as Categories
    const subcategory = searchParams.get('subcategory') as Subcategories

    const { products, totalProducts } = await getProductsDb({
      page,
      category: categories[category] ? category : undefined,
      subcategory: subcategories[subcategory] ? subcategory : undefined,
    })
    return NextResponse.json({ data: products, totalData: totalProducts })
  }

  notFound()
}
