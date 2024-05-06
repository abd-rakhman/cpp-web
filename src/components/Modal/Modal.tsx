import type { HTMLAttributes } from 'react';
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';

import { withClassName } from '@src/components/_hocs/withClassName';

import cls from './Modal.module.scss';
import { BsXLg } from 'react-icons/bs';

interface Props extends Dialog.DialogProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  close?: boolean;
}

export const ModalTitle = withClassName(Dialog.Title, cls.title);

export const ModalDescription = withClassName(Dialog.Description, cls.description);

export const ModalActions: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={clsx(cls.actions, className)} {...props} />
);

const Modal: React.FC<Props> = ({ maxWidth = 'sm', title, description, actions, children, open, close, ...props }) => {
  return (
    <Dialog.Root
      open={open}
      {...props}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={cls.overlay}>
          <div className={cls.wrapper}>
            <Dialog.Content className={cls.content} data-width={maxWidth}>
              {title && <ModalTitle>{title}</ModalTitle>}
              {description && <ModalDescription>{description}</ModalDescription>}
              {close ? (
                <Dialog.DialogClose className={cls.close}>
                  <BsXLg style={{color: 'black'}}/>
                </Dialog.DialogClose>
              ) : null}
              {children}
              {actions && <Dialog.Close className={cls.actions}>{actions}</Dialog.Close> }
            </Dialog.Content>
          </div>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
