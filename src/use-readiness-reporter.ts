import { useCallback, useContext, useId, useLayoutEffect } from "react";
import { ReadinessContext } from "./readiness-context";

/**
 * Hook that enables a component to participate in a readiness tracking system.
 *
 * Manages component's lifecycle within the readiness context by:
 * - Automatically registering on mount
 * - Cleaning up on unmount
 * - Providing a ready-state reporter function
 *
 * @returns A memoized callback function to report readiness
 */
export const useReadinessReporter = () => {
  const id = useId();
  const { markReady, register, unregister } = useContext(ReadinessContext);

  useLayoutEffect(() => {
    register(id);

    return () => unregister(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useCallback(() => markReady(id), [id, markReady]);
};
