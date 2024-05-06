import { BsCheck, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import * as SelectBase from '@radix-ui/react-select';
import clsx from 'clsx';

import cls from './Select.module.scss';
import React from 'react';

interface AdvanceOption {
    label: React.ReactNode;
    value: string;
}

type Props = SelectBase.SelectProps & {
    items?: AdvanceOption[];
    label?: string;
    fullWidth?: boolean;
    className?: string;
}

export const Select: React.FC<Props> = ({ label, className, items = [], fullWidth, ...props }) => {
    return (
        <SelectBase.Root {...props}>
            <SelectBase.Trigger className={clsx(cls.root, fullWidth && cls.fullWidth)}>
                {label && <label className={cls.label}>{label}</label>}
                <div className={clsx(cls.select, className)}>
                    <SelectBase.Value className={cls.value} />
                    <SelectBase.Icon>
                        <BsChevronDown className={cls.chevron} />
                    </SelectBase.Icon>
                </div>
            </SelectBase.Trigger>

            <SelectBase.Portal>
                <SelectBase.Content className={cls.content}>
                    <SelectBase.ScrollUpButton className={cls.scrollButton}>
                        <BsChevronUp />
                    </SelectBase.ScrollUpButton>
                    <SelectBase.Viewport>
                        {items.map(({ value, label }) => (
                            <SelectBase.Item className={cls.item} value={value} key={value}>
                                <div className={cls.itemContent}>
                                    <SelectBase.ItemText>
                                        {label}
                                    </SelectBase.ItemText>
                                </div>
                                <SelectBase.ItemIndicator className={cls.check}>
                                    <BsCheck />
                                </SelectBase.ItemIndicator>
                            </SelectBase.Item>
                        ))}
                    </SelectBase.Viewport>
                    <SelectBase.ScrollDownButton className={cls.scrollButton}>
                        <BsChevronDown />
                    </SelectBase.ScrollDownButton>
                </SelectBase.Content>
                </SelectBase.Portal>
        </SelectBase.Root>
    );
};
