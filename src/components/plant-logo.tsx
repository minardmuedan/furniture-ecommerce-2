import Image from 'next/image'

type Props = { width?: number; height?: number; className?: string }

export default function PlantLogo({ width = 20, height = 20, className }: Props) {
  return <Image src="/plant-logo.svg" alt="plant logo" width={width} height={height} className={className} />
}
