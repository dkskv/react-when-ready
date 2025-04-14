import { useLayoutEffect, useRef } from "react";

/**
 * A modified version of `useLayoutEffect` that only triggers when a condition is met
 * and (optionally) runs just once during the component's lifecycle.
 *
 * @param condition - Boolean flag that enables the effect
 * @param effect - Callback function (same as in `useLayoutEffect`)
 * @param isOnce - If `true`, the effect will fire only once (default: `true`)
 *
 * @example
 * // Runs only when `isVisible=true` and only once
 * useConditionalLayoutEffect(
 *   isVisible,
 *   () => console.log('Component became visible'),
 *   true
 * );
 */
export const useConditionalLayoutEffect = (
  condition: boolean,
  effect: () => void,
  isOnce = true
) => {
  const isTriggered = useRef(false);

  useLayoutEffect(() => {
    if (!condition) {
      return;
    }

    if (isOnce && isTriggered.current) {
      return;
    }

    isTriggered.current = true;
    effect();
  });
};
