import { BsArrowRepeat } from 'react-icons/bs'
import cls from './Loading.module.scss'

export const LoadingPage = () => {
  return (
    <main className={cls.root}>
      <BsArrowRepeat size={24} className={cls.loading} />
    </main>
  )
}