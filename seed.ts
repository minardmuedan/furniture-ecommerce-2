import { db } from '@/db'
import { copyFileSync, mkdirSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import sharp from 'sharp'

const root = process.cwd()

const seed = async () => {
  readdirSync(path.join(root, 'public', 'cropped-nobg')).map((src) => {
    const parts = src.split('.')
    const category = parts[0]
    const subcategory = parts[1]
    const product = parts[2]

    copyFileSync(
      path.join(root, 'public', 'cropped-nobg', src),
      path.join(root, 'public', 'cropped-nobg-categorized', category, subcategory, `${product}.png`),
    )
  })
}

seed()
