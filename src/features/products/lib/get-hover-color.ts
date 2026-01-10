import { addOpacityToHex, getContrastColor } from '@/lib/utils'

export const getProductHoverColor = (color: string) => {
  const contrast = getContrastColor(color)
  if (contrast >= 0.96) return '#f3f4f6'
  return addOpacityToHex(color, contrast <= 0.8 ? contrast - 0.2 : 1)
}
