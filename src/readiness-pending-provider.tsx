import React from "react";
import { useCallback, useMemo, useRef } from "react";
import { ReadinessContext, ReadinessContextValue } from "./readiness-context";
import { useReadinessReporter } from "./use-readiness-reporter";

interface Props {
  /** Child elements that can report their readiness */
  children: React.ReactNode;
  /**
   * Callback invoked when all child consumers (and the provider itself)
   * have reported readiness. Called only once.
   */
  onReady?: () => void;
}

/**
 * Provider for managing readiness state of nested components.
 *
 * How it works:
 * 1. Registers all child components using the readiness context
 * 2. Tracks their readiness status via onReady() calls
 * 3. Transitions to "ready" state when:
 *    - At least one child component reported readiness
 *    - All registered components have completed their work
 *
 * Features:
 * - Supports nesting: can itself be a context consumer
 * - Guarantees single onReady invocation
 * - Optional onReady prop callback
 */
export const ReadinessPendingProvider: React.FC<Props> = ({
  children,
  onReady: onReadyProps,
}) => {
  // Hook to report own readiness (if nested within another provider)
  const onReady = useReadinessReporter();

  /** Set of IDs for child elements that haven't reported readiness yet */
  const pendingIds = useRef(new Set<string>());
  /** Flag indicating if the provider has already triggered the ready state */
  const wasReady = useRef(false);
  /** Flag indicating if at least one child has reported readiness */
  const wasSomeReady = useRef(false);

  const handleReady = useCallback(() => {
    wasReady.current = true;
    onReady();
    onReadyProps?.();
  }, [onReady, onReadyProps]);

  const contextValue = useMemo<ReadinessContextValue>(
    () => ({
      register(id: string) {
        if (wasReady.current) {
          return;
        }

        pendingIds.current.add(id);
      },
      unregister(id: string) {
        if (wasReady.current) {
          return;
        }

        pendingIds.current.delete(id);

        if (wasSomeReady.current && pendingIds.current.size === 0) {
          handleReady();
        }
      },
      markReady: (id: string) => {
        if (wasReady.current) {
          return;
        }

        wasSomeReady.current = true;
        pendingIds.current.delete(id);

        if (pendingIds.current.size === 0) {
          handleReady();
        }
      },
    }),
    [handleReady]
  );

  return (
    <ReadinessContext.Provider value={contextValue}>
      {children}
    </ReadinessContext.Provider>
  );
};
