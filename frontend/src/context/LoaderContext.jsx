import { createContext, useContext, useState } from "react";

const LoaderContext = createContext({ loaderDone: false });

export function LoaderProvider({ children }) {
  const [loaderDone, setLoaderDone] = useState(false);
  return (
    <LoaderContext.Provider value={{ loaderDone, setLoaderDone }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
