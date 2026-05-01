import { createContext, useContext } from "react";

export const RouterContext = createContext(null);

export function useRouter() {
  const value = useContext(RouterContext);
  if (!value) {
    throw new Error("useRouter must be used inside RouterContext");
  }
  return value;
}
