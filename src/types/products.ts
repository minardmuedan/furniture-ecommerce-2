import type { Subcategories, Categories } from '@/lib/categories'
import type { Pagination } from './helpers'

export type ProductImageType = { src: string; alt: string; color: string; blurHash: string }

export type Product = {
  id: string
  title: string
  prevPrice: string
  price: string
  category: Categories
  subcategory: Subcategories
  image: ProductImageType
}

export type PaginationProducts = Pagination<Product>

export type CartDataProduct = {
  id: string
  price: string
  productId: string
  quantity: number
  product: Product & { stocks: { availableQuantity: number } }
}
