const SPRITE_PATH = '/icons/icon-sprite.svg'

export type IconProps = {
  iconId: string
  width?: number
  height?: number
  viewBox?: string
  fill?: string
  className?: string
}

export const Icon = ({
  iconId,
  width = 24,
  height = 24,
  viewBox = '0 0 24 24',
  fill = 'currentColor',
  className,
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      className={className}
      xmlns="http://www.w3.org/2000/svg">
      <use href={`${SPRITE_PATH}#${iconId}`} />
    </svg>
  )
}
