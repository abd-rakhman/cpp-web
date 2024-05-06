import clsx from 'clsx';
import React from 'react';

import cls from './Card.module.scss';

type Props = React.ComponentProps<'div'> & {
    dense?: boolean;
    dark?: boolean;
    shimmer?: boolean;
};

export const Card = React.forwardRef<HTMLDivElement, Props>((
    { className, dense, dark, shimmer, ...props },
    ref,
) => (
    <div data-dense={dense} className={clsx(className, cls.root, dark && cls.dark, shimmer && cls.shimmer)} ref={ref} {...props} />
));

Card.displayName = 'Card';
