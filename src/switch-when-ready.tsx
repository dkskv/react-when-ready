import React, { CSSProperties } from "react";
import { useCallback, useState } from "react";
import { useDelayedLoading } from "./use-delayed-loading";
import { ReadinessPendingProvider } from "./readiness-pending-provider";

export interface SwitchWhenReadyProps<Key extends string> {
  /** Key of the currently active content */
  activeKey: Key | undefined;
  /** Content rendering function that accepts a key */
  renderByKey: (key: Key) => React.ReactNode;

  /** Delay before showing the loader (in milliseconds) */
  loaderDelay?: number;
  /** Wrapper render function that handles loading state UI */
  renderWithLoading?: (params: {
    content: React.ReactNode;
    isShowLoading: boolean;
  }) => React.ReactNode;
  /**
   * Function that returns CSS styles for content wrappers based on visibility state
   * @param shouldHide - Indicates whether the wrapped content should be hidden
   * @returns CSSProperties object with styles to apply to the wrapper
   * @default (shouldHide) => ({ display: shouldHide ? "none" : "contents" })
   */
  getContentWrapperStyle?: (shouldHide: boolean) => CSSProperties;
}

/**
 * Component for smooth transitions between UI components
 * with content readiness handling and loading states
 */
export const SwitchWhenReady = <Key extends string>({
  activeKey,
  renderByKey,
  loaderDelay = 0,
  renderWithLoading = ({ content }) => content,
  getContentWrapperStyle = (shouldHide) => ({
    display: shouldHide ? "none" : "contents",
  }),
}: SwitchWhenReadyProps<Key>) => {
  const [lastReadyKey, setLastReadyKey] = useState<Key>();

  /**
   * The content key to display while the active content is preparing.
   * Shows previous content while new content loads.
   */
  const placeholderKey = activeKey === lastReadyKey ? undefined : lastReadyKey;

  const handleActiveReady = useCallback(
    () => setLastReadyKey(activeKey),
    [activeKey]
  );

  const hasPlaceholder = placeholderKey !== undefined;
  const hasActive = activeKey !== undefined;

  const isActiveLoading = hasPlaceholder || lastReadyKey === undefined;
  const isShowLoading = useDelayedLoading(isActiveLoading, loaderDelay);

  const content = (
    <>
      {hasActive && (
        <ReadinessPendingProvider key={activeKey} onReady={handleActiveReady}>
          <div style={getContentWrapperStyle(isActiveLoading)}>
            {renderByKey(activeKey)}
          </div>
        </ReadinessPendingProvider>
      )}
      {hasPlaceholder && (
        <ReadinessPendingProvider key={placeholderKey}>
          <div style={getContentWrapperStyle(false)}>
            {renderByKey(placeholderKey)}
          </div>
        </ReadinessPendingProvider>
      )}
    </>
  );

  return renderWithLoading({ content, isShowLoading });
};
