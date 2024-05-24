import { IconProps } from "./types"

export const CodeforcesIcon: React.FC<IconProps> = ({ size = 24, ...props }) => {
  return (
    <svg
      fill="#1F8ACB"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      {...props}
    >
      <path d="M4.5 7.5A1.5 1.5 0 016 9v10.5A1.5 1.5 0 014.5 21h-3C.673 21 0 20.328 0 19.5V9c0-.828.673-1.5 1.5-1.5h3zm9-4.5A1.5 1.5 0 0115 4.5v15a1.5 1.5 0 01-1.5 1.5h-3c-.827 0-1.5-.672-1.5-1.5v-15c0-.828.673-1.5 1.5-1.5h3zm9 7.5A1.5 1.5 0 0124 12v7.5a1.5 1.5 0 01-1.5 1.5h-3a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5h3z" />
    </svg>
  )
}