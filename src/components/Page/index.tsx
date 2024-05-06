import React from "react";
import { Stack } from "../Stack";
import { Text } from "../Typography";
import cls from "./Page.module.scss";

import clsx from "clsx";

interface PageProps {
  title: string;
  grow?: number;
  children: React.ReactNode;
  navigation?: React.ReactNode;
  footer?: React.ReactNode;
  fullPage?: boolean;
}

export const Page: React.FC<React.ComponentProps<'div'> & PageProps> = ({ className, title, grow, children, navigation, footer}) => (
  <Stack direction='column' className={clsx(className, cls.page)} grow={grow}>
    <Stack justifyContent="space-between" className={cls.header}>
      <Text bold size='large' className={cls.textSize}>
        {title}
      </Text>
      {navigation}
    </Stack>
    {children}
    {footer && <Stack className={cls.footer}>{footer}</Stack>}
  </Stack>
);