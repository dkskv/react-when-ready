import { useLayoutEffect, useState } from "react";

export const useDelayedValue = <T>(value: T, delay: number) => {
  const [valueState, setValueState] = useState<T | null>(null);

  useLayoutEffect(() => {
    if (delay > 0) {
      const timerId = setTimeout(() => {
        setValueState(value);
      }, delay);

      return () => {
        clearTimeout(timerId);
      };
    } else {
      setValueState(value);
    }
  }, [delay, value]);

  return valueState;
};
