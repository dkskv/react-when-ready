import { createContext } from "react";

const noop = () => {};

export const defaultValue: ReadinessContextValue = {
  register: noop,
  unregister: noop,
  markReady: noop,
};

export interface ReadinessContextValue {
  /** Register new context consumer */
  register: (id: string) => void;
  /** Remove consumer (without readiness report) */
  unregister: (id: string) => void;
  /** Handler for individual consumer readiness */
  markReady: (id: string) => void;
}

export const ReadinessContext =
  createContext<ReadinessContextValue>(defaultValue);
