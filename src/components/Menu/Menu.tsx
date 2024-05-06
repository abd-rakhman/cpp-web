import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DotFilledIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import React, { type HTMLAttributes, type ReactNode } from 'react';

import { withClassName } from '../_hocs/withClassName';
import { Stack } from '../Stack';
import cls from './Menu.module.scss';
import { BsCheck } from 'react-icons/bs';

export const withIcon = <T extends { children?: ReactNode }>(Component: React.ComponentType<T>) => {
  const ComponentWithClassName = (props: T & { icon: ReactNode }) => {
    const { icon, children } = props;
    const omittedProps = { ...props };

    delete omittedProps.icon;
    delete omittedProps.children;

    return (
      <Component {...omittedProps}>
        <Stack gap={8} alignItems="center">
          <div className={cls.icon}>{icon}</div>
          <span>{children}</span>
        </Stack>
      </Component>
    );
  };

  return ComponentWithClassName;
};

export const MenuLabel = withClassName(DropdownMenu.Label, cls.label);
export const MenuItem = withClassName(DropdownMenu.Item, cls.item);
export const MenuSub = DropdownMenu.Sub;
export const MenuSubTrigger = withClassName(DropdownMenu.SubTrigger, cls.item);
export const MenuPortal = withClassName(DropdownMenu.Portal, cls.item);
export const MenuSubContent = withClassName(DropdownMenu.SubContent, cls.root);
export const MenuRightSlot = withClassName((props: HTMLAttributes<HTMLDivElement>) => <div {...props} />, cls.rightSlot);

export const MenuItemWithIcon = withIcon(MenuItem);

export const MenuSeparator = withClassName(DropdownMenu.Separator, cls.separator);

export const MenuCheckboxItem: React.FC<DropdownMenu.DropdownMenuCheckboxItemProps> = ({ className, children, ...props }) => (
  <DropdownMenu.CheckboxItem
    className={clsx(cls.item, cls.checkboxItem, className)}
    {...props}
  >
    <DropdownMenu.ItemIndicator className={cls.indicator}>
      <DotFilledIcon />
    </DropdownMenu.ItemIndicator>
    {children}
  </DropdownMenu.CheckboxItem>
);

export const MenuRadioGroup = withClassName(DropdownMenu.RadioGroup, cls.radioGroup);

export const MenuRadioItem: React.FC<DropdownMenu.DropdownMenuRadioItemProps> = ({ className, children, ...props }) => (
  <DropdownMenu.RadioItem
    className={clsx(cls.item, cls.radioItem, className)}
    {...props}
  >
    {children}
    <DropdownMenu.ItemIndicator className={cls.indicator}>
      <BsCheck />
    </DropdownMenu.ItemIndicator>
  </DropdownMenu.RadioItem>
);

interface Props extends DropdownMenu.DropdownMenuProps {
  content: ReactNode;
  align?: 'start' | 'center' | 'end';
  alignOfset?: number
  sideOfset?: number;
}

const Menu: React.FC<Props> = ({
  content,
  children,
  align = 'center',
  alignOfset = 0,
  sideOfset = 8,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
  ...props
}) => {
  const [open, setOpen] = React.useState(propsOpen);

  const onOpenChange = React.useCallback((open: boolean) => {
    setOpen(open);
    propsOnOpenChange?.(open);
  }, [propsOnOpenChange]);

  React.useEffect(() => {
    setOpen(propsOpen);
  }, [propsOpen]);

  return (
    <DropdownMenu.Root
      open={open}
      onOpenChange={onOpenChange}
      {...props}
    >
      <DropdownMenu.Trigger>
        {children}
      </DropdownMenu.Trigger>
      {open ? (
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={sideOfset}
            alignOffset={alignOfset}
            align={align}
            style={{backgroundColor: 'white', border: '1px solid #E5E5E5', padding: '8px', borderRadius: '4px'}}
          >
            {content}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      ) : null}
    </DropdownMenu.Root>
  );
};

export default Menu;