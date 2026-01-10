import path from 'path'
import sharp from 'sharp'
import { encode } from 'blurhash'
import Bhash from './comp'
import { getPlaiceholder } from 'plaiceholder'
import { readFileSync } from 'fs'

const dir = 'cropped-withbg-images'
const productPath = 'office.office-chairs.christina-mesh-office-chair-black.png'
const imgpath = path.join(process.cwd(), 'public', dir, productPath)

export default async function AboutPage() {
  const { data, info } = await sharp(imgpath).resize(64, null).raw().toBuffer({ resolveWithObject: true })

  const base64Image = data.toString('base64')
  const dataUrl = `data:image/jpeg;base64,${base64Image}`

  const hash = encode(new Uint8ClampedArray(data), info.width, info.height, 8, 8)

  return (
    <>
      <div className="flex gap-10 p-10">
        <img src={dataUrl} alt="" />
        <img src={`/${dir}/${productPath}`} alt="" />

        <div className="bg-red-500">
          <Bhash hash={hash} />
        </div>
      </div>
      {hash}
    </>
  )
}
