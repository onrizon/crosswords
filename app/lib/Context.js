import { createContext, useContext, useMemo } from 'react';

export const SystemContext = createContext({});
export const ModalContext = createContext({});

export function withData(Component, cb) {
  return (props) => {
    const ctx = useContext(SystemContext);
    const data = cb ? cb(ctx) : ctx;
    return useMemo(
      () => <Component {...props} {...data} />,
      [...Object.values(data), ...Object.values(props)],
    );
  };
}
