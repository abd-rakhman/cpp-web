import React from "react";
import cls from "./Backdrop.module.scss";

interface BackdropProps {
  children: React.ReactNode;
  isShow: boolean;
}

export const BackDrop: React.FC<BackdropProps & React.ComponentProps<'div'>> = ( { children, isShow, ...props },
) => (
  <>
    {isShow && (
      <div className={cls.backdrop} {...props}>
        {children}
      </div>
    )}
  </>
);
