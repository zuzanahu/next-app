import { useState } from "react";

export const useAutoResetState = <T>(options: {
  timeout: number;
  defaultValue?: T;
}) => {
  const [current, setCurrent] = useState<T | undefined>(options.defaultValue);

  const handleSetCurrent: typeof setCurrent = (nextValueOrFunction) => {
    setCurrent(nextValueOrFunction);

    setTimeout(() => {
      setCurrent(undefined);
    }, options.timeout);
  };

  return [current, handleSetCurrent] as const;
};
