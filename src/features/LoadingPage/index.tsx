import { BsArrowRepeat } from 'react-icons/bs'
import cls from './Loading.module.scss'

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
}

const sizeMap = {
  small: 12,
  default: 16,
  large: 24,
}

export const LoadingPage = ({ size = 'large'}: LoadingProps) => {
  return (
    <main className={cls.root}>
      <BsArrowRepeat size={sizeMap[size]} className={cls.loading} />
    </main>
  )
}

export const LoadingBackdrop = ({ size = 'default'}: LoadingProps) => {
  return (
    <div className={cls.backdrop}>
      <BsArrowRepeat size={sizeMap[size]} className={cls.loading} />
    </div>
  )
}