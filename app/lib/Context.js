import { createContext, useContext, useMemo } from 'react';

export const Context = createContext({});

export function withData(Component, cb) {
  return (props) => {
    const ctx = useContext(Context);
    const data = cb ? cb(ctx) : ctx;
    return useMemo(
      () => <Component {...props} {...data} />,
      [...Object.values(data), ...Object.values(props)]
    );
  };
}
