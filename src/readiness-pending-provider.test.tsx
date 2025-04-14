import React, { useContext, useEffect } from "react";
import { ReadinessPendingProvider } from "./readiness-pending-provider";
import { ReadinessContext, ReadinessContextValue } from "./readiness-context";
import { render } from "@testing-library/react";

describe("ReadinessPendingProvider", () => {
  function ContextConsumer({
    onInit,
  }: {
    onInit: (contextValue: ReadinessContextValue) => void;
  }) {
    const contextValue = useContext(ReadinessContext);

    useEffect(() => {
      onInit(contextValue);
    }, []);

    return null;
  }

  let mockOnReady: jest.Mock;
  let contextValue: ReadinessContextValue;

  beforeEach(() => {
    mockOnReady = jest.fn();

    render(
      <ReadinessPendingProvider onReady={mockOnReady}>
        <ContextConsumer
          onInit={(v) => {
            contextValue = v;
          }}
        />
      </ReadinessPendingProvider>
    );
  });

  it("should NOT complete overall readiness when canceling the only pending element", () => {
    contextValue.register("a");
    contextValue.unregister("a");

    expect(mockOnReady).toHaveBeenCalledTimes(0);
  });

  it("should complete overall readiness when canceling last pending element if at least 1 element was ready", () => {
    contextValue.register("a");
    contextValue.register("b");
    contextValue.register("c");

    contextValue.markReady("a");
    contextValue.markReady("b");

    expect(mockOnReady).toHaveBeenCalledTimes(0);

    contextValue.unregister("b");

    expect(mockOnReady).toHaveBeenCalledTimes(0);

    contextValue.unregister("c");

    expect(mockOnReady).toHaveBeenCalledTimes(1);
  });

  it("should ignore all child calls after reaching ready state", () => {
    contextValue.register("a");
    contextValue.register("b");

    contextValue.markReady("a");
    contextValue.markReady("b");

    expect(mockOnReady).toHaveBeenCalledTimes(1);

    contextValue.markReady("a");
    contextValue.markReady("b");

    expect(mockOnReady).toHaveBeenCalledTimes(1);
  });
});
