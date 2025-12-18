import type { Subcategories, Categories } from '@/lib/categories'
import type { Pagination } from './helpers'

export type ProductImage = { src: string; alt: string; color: string; blurHash: string }

export type Product = {
  id: string
  description: string
  title: string
  prevPrice: string
  price: string
  category: Categories
  subcategory: Subcategories
  stocks: number
  image: ProductImage
}

export type PaginationProducts = Pagination<Product>
