import React from 'react';
import cls from './RadioButton.module.scss';
import clsx from 'clsx';

interface RadioProps {
  id: string;
  name: string;
  value: string;
  title: string;
  checked?: boolean;
  bold?: boolean;
  border?: boolean;
}

export const RadioButton: React.FC<React.ComponentProps<'label'> & React.ComponentProps<'input'> & RadioProps> = ({ id, name, value, title, border, bold, checked, className, onChange }) => {
  return (
    <>
      <input type='radio' id={id} name={name} value={value} className={cls.radio} checked={checked} onChange={onChange}/>
      <label htmlFor={id} className={clsx(cls.label, className, border && cls.border, bold && cls.bold )} >
        {title}
      </label>
    </>
  );
};