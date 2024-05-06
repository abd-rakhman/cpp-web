import AvatarFallback from 'boring-avatars';
import clsx from 'clsx';
import cls from './Avatar.module.scss';
import React from 'react';

interface AvatarProps {
    name: string;
    img?: string;
    size: number;
    className?: string;
}

const COLORS = [
    '#93c5fd',
    '#60a5fa',
    '#3b82f6',
    '#2563eb',
    '#1d4ed8',
];

export const Avatar: React.FC<AvatarProps> = ({ name, img, size, className }) => {
    return (
        <div style={{
            height: size,
            width: size,
            flexShrink: 0,
        }} className={clsx(cls.root, className)}>
            <div className={cls.image} style={{
                backgroundImage: img ? `url(${img})` : '',
            }} />
            <AvatarFallback size={size} name={name} colors={COLORS} variant='marble' />
        </div>
    )
}