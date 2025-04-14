import { useDelayedValue } from "./use-delayed-value";

export const useDelayedLoading = (isLoading: boolean, delay: number) =>
  useDelayedValue(isLoading, isLoading ? delay : 0) ?? false;
