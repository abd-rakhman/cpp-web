import React from "react"
import cls from './Alert.module.scss';
import clsx from "clsx";
import { BsInfoCircle } from "react-icons/bs";

interface AlertProps {
    icon?: React.ReactNode;
    children?: React.ReactNode;
    variant?: 'default' | 'success' | 'error';
}

export const Alert: React.FC<AlertProps> = ({ icon = <BsInfoCircle />, children, variant = 'default' }) => {
    return (
        <div className={clsx(cls.root, cls[`variant-${variant}`])}>
            <div className={cls.icon}>
                {icon}
            </div>
            <div>{children}</div>
        </div>
    )
}
