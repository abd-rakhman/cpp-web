import clsx from 'clsx';
import React from 'react';

import cls from './Typography.module.scss';

interface TextProps {
    size?: 'small' | 'default' | 'large';
    color?: 'default' | 'primary' | 'secondary' | 'error';
    align?: 'left' | 'center';
    bold?: boolean;
    overflow?: boolean;
}

export const Text: React.FC<React.ComponentProps<'span'> & TextProps & { block?: boolean }> = ({ className, size = 'default', color = 'default', align = 'left', block, bold, overflow, ...props }) => (
    <span className={clsx(className, cls[`size-${size}`], cls[`color-${color}`], cls[`align-${align}`], block && cls.block, bold && cls.bold, overflow && cls.overflow)} {...props} />
);

export const TextSkeleton: React.FC<React.ComponentProps<'span'> & TextProps & { width?: number }> = ({ className, size = 'default', color = 'default', align = 'left', width = 48, bold, overflow, }) => (
    <span style={{
        width,
    }} className={clsx(className, cls[`size-${size}`], cls[`color-${color}`], cls[`align-${align}`], bold && cls.bold, overflow && cls.overflow)}>
        <span className={cls.skeleton} />
    </span>
);

export const Paragraph: React.FC<React.ComponentProps<'p'> & TextProps> = ({ className, size = 'default', color = 'default', align = 'left', bold, overflow, ...props }) => (
    <p className={clsx(className, cls[`size-${size}`], cls[`color-${color}`], cls[`align-${align}`], bold && cls.bold, overflow && cls.overflow)} {...props} />
);
