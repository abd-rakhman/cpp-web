import { BsXLg } from "react-icons/bs";
import { Stack } from "../Stack"
import { Text } from "../Typography"
import cls from "./Form.module.scss"
import clsx from "clsx";
import React from "react";

interface FormProps {
  title: string;
  children: React.ReactNode;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export const Form: React.FC<FormProps & React.ComponentProps<'div'>> = ({title, children, className, handleSubmit, onClose}) => {
  return (
    <Stack direction="column" className={clsx(cls.root, className)}>
      <Stack justifyContent="space-between" className={cls.header}>
        <Text size='large' bold>
          {title}
        </Text>
        <button onClick={onClose}>
          <BsXLg />
        </button>
      </Stack>
      <Stack direction="column" alignItems="center" grow={1} className={cls.body}>
        <form className={cls.form} onSubmit={handleSubmit}>
          {children}
        </form>
      </Stack>
    </Stack>
  )
}