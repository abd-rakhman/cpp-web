import * as CheckboxBase from '@radix-ui/react-checkbox';
import React from 'react';
import cls from './Checkbox.module.scss';

export const Checkbox: React.FC<CheckboxBase.CheckboxProps> = ({ children, ...props }) => {
    return (
        <CheckboxBase.Root className={cls.root} {...props}>
            <div className={cls.indicatorWrapper}>
                <CheckboxBase.Indicator className={cls.indicator}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 7L9 17L5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </CheckboxBase.Indicator>
            </div>
            <label className={cls.label}>{children}</label>
        </CheckboxBase.Root>
    );
};
