import { useConditionalLayoutEffect } from "./use-conditional-effect";
import { useReadinessReporter as useReadinessReporter } from "./use-readiness-reporter";

/**
 * A specialized hook that reports readiness to a parent `ReadinessPendingProvider`
 * when a specific condition becomes true.
 *
 * @param condition - Boolean flag indicating when the consumer is considered ready
 * @returns void
 */
export const useReadinessOnCondition = (condition: boolean) => {
  const onReady = useReadinessReporter();

  useConditionalLayoutEffect(condition, onReady);
};
