import { useCallback, useRef } from "react";

export const useDebounce = (fn: Function, delay: number) => {
  const timerRef = useRef<number | null>(null);

  return useCallback((...args: any[]) => {
    if(timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      fn(...args);
    }, delay)
  }, [fn, delay])
}