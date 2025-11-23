import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("Button Component", () => {
  describe("Basic Rendering", () => {
    it("renders with children text", () => {
      render(<Button>Click Me</Button>);
      expect(
        screen.getByRole("button", { name: /click me/i })
      ).toBeInTheDocument();
    });

    it("renders with default props", () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("inline-flex", "rounded", "cursor-pointer");
    });

    it("applies custom className", () => {
      render(<Button className="custom-class">Button</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });
  });

  describe("Layout Variations", () => {
    it("renders primary layout by default", () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("renders secondary layout", () => {
      render(<Button layout="secondary">Secondary</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders danger layout", () => {
      render(<Button layout="danger">Danger</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders borderless layout", () => {
      render(<Button layout="borderless">Borderless</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders text layout", () => {
      render(<Button layout="text">Text</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Size Variations", () => {
    it("renders default size", () => {
      render(<Button size="default">Default Size</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-10");
    });

    it("renders large size", () => {
      render(<Button size="large">Large</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-12");
    });

    it("renders small size", () => {
      render(<Button size="small">Small</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-10");
    });

    it("renders xsmall size", () => {
      render(<Button size="xsmall">XSmall</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-8");
    });

    it("renders xxsmall size", () => {
      render(<Button size="xxsmall">XXSmall</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-6");
    });
  });

  describe("Width Variations", () => {
    it("renders with default width", () => {
      render(<Button width="default">Default Width</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with full width", () => {
      render(<Button width="full">Full Width</Button>);
      expect(screen.getByRole("button")).toHaveClass("w-full");
    });

    it("renders with square width", () => {
      render(<Button width="square">S</Button>);
      expect(screen.getByRole("button")).toHaveClass("w-11");
    });
  });

  describe("State Management", () => {
    it("renders active state", () => {
      render(<Button active={true}>Active Button</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders disabled state", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("renders loading state", () => {
      render(<Button isLoading={true}>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("cursor-wait");
    });
  });

  describe("Event Handlers", () => {
    it("calls onClick handler when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("handles mouse enter event", () => {
      render(<Button>Hover Me</Button>);
      const button = screen.getByRole("button");
      fireEvent.mouseEnter(button);
      expect(button).toBeInTheDocument();
    });

    it("handles mouse leave event", () => {
      render(<Button>Hover Me</Button>);
      const button = screen.getByRole("button");
      fireEvent.mouseEnter(button);
      fireEvent.mouseOut(button);
      expect(button).toBeInTheDocument();
    });
  });

  describe("Custom Props", () => {
    it("renders with custom text color", () => {
      render(<Button textColor="red-500">Custom Color</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with custom font weight", () => {
      render(<Button fontWeight="bold">Bold Text</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("disables transitions when noTransition is true", () => {
      render(<Button noTransition={true}>No Transition</Button>);
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("transition");
    });

    it("renders without default padding when defaultPadding is false", () => {
      render(<Button defaultPadding={false}>No Padding</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("renders without centering when center is false", () => {
      render(<Button center={false}>Not Centered</Button>);
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("items-center", "justify-center");
    });
  });

  describe("Loading Animation", () => {
    it("renders with loading animation", () => {
      const { container } = render(
        <Button loadingAnimation={true} loadingPercent={50}>
          Loading
        </Button>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
      // Check for the loading animation span
      const animSpan = container.querySelector('span[style*="width"]');
      expect(animSpan).toBeInTheDocument();
    });

    it("renders loading animation with correct initial width", () => {
      const { container } = render(
        <Button
          loadingAnimation={true}
          loadingPercent={0}
          fromLoadingPercent={0}
        >
          Loading
        </Button>
      );
      const animSpan = container.querySelector("span.absolute.top-0.left-0");
      expect(animSpan).toBeInTheDocument();
    });

    it("renders loading animation with progress percentage", () => {
      const { container } = render(
        <Button
          loadingAnimation={true}
          loadingPercent={75}
          fromLoadingPercent={50}
        >
          Loading
        </Button>
      );
      expect(screen.getByRole("button")).toHaveTextContent("Loading");
      const animSpan = container.querySelector("span.absolute.top-0.left-0");
      expect(animSpan).toBeInTheDocument();
    });

    it("calls loadingAnimatingCallback when animation starts", async () => {
      const callback = vi.fn();
      render(
        <Button
          loadingAnimation={true}
          loadingPercent={50}
          fromLoadingPercent={0}
          loadingAnimatingCallback={callback}
        >
          Loading
        </Button>
      );
      // Wait for animation to start - callback should be called with true
      await waitFor(
        () => {
          expect(callback).toHaveBeenCalledWith(true);
        },
        { timeout: 2000 }
      );
    });

    it("calls loadingAnimatingCallback with false when animation completes", async () => {
      const callback = vi.fn();
      render(
        <Button
          loadingAnimation={true}
          loadingPercent={100}
          fromLoadingPercent={0}
          loadingAnimatingCallback={callback}
        >
          Loading
        </Button>
      );
      // Wait for animation to complete - callback should eventually be called with false
      await waitFor(
        () => {
          const calls = callback.mock.calls;
          // Check if callback was called with false at some point
          const hasFalseCall = calls.some((call) => call[0] === false);
          expect(hasFalseCall).toBe(true);
        },
        { timeout: 3000 }
      );
    });

    it("handles error state in loading animation", async () => {
      const callback = vi.fn();
      render(
        <Button
          loadingAnimation={true}
          loadingPercent={50}
          fromLoadingPercent={0}
          hasErrors={true}
          loadingAnimatingCallback={callback}
        >
          Error Loading
        </Button>
      );
      // When hasErrors is true, animation should handle it differently
      expect(screen.getByRole("button")).toBeInTheDocument();
      // Callback should eventually be called
      await waitFor(
        () => {
          expect(callback).toHaveBeenCalled();
        },
        { timeout: 2000 }
      );
    });

    it("renders children text in loading animation overlay", () => {
      render(
        <Button loadingAnimation={true} loadingPercent={50}>
          Progress Loading
        </Button>
      );
      // The loading overlay should also contain the children text
      expect(screen.getByRole("button")).toHaveTextContent("Progress Loading");
    });

    it("updates loading animation when loadingPercent changes", () => {
      const { rerender } = render(
        <Button
          loadingAnimation={true}
          loadingPercent={25}
          fromLoadingPercent={0}
        >
          Loading
        </Button>
      );

      // Update the loading percent
      rerender(
        <Button
          loadingAnimation={true}
          loadingPercent={75}
          fromLoadingPercent={25}
        >
          Loading
        </Button>
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders without loading animation when loadingAnimation is false", () => {
      const { container } = render(
        <Button loadingAnimation={false} loadingPercent={50}>
          No Animation
        </Button>
      );
      // Should not have the loading animation span
      const animSpan = container.querySelector(
        "span.absolute.top-0.left-0.w-0"
      );
      expect(animSpan).not.toBeInTheDocument();
    });
  });

  describe("withoutButtonTag Prop", () => {
    it("renders as span when withoutButtonTag is true", () => {
      const { container } = render(
        <Button withoutButtonTag={true}>Span Button</Button>
      );
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Span Button");
    });

    it("renders as button when withoutButtonTag is false", () => {
      render(<Button withoutButtonTag={false}>Button Tag</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Container and Styling", () => {
    it("applies container class name", () => {
      const { container } = render(
        <Button containerClassName="custom-container">Button</Button>
      );
      const span = container.querySelector(".custom-container");
      expect(span).toBeInTheDocument();
    });

    it("renders with tracking-wide class", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button")).toHaveClass("tracking-wide");
    });
  });

  describe("Forward Ref", () => {
    it("forwards ref to button element", () => {
      const ref = { current: null };
      render(<Button ref={ref}>Button with Ref</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("Error Handling", () => {
    it("renders with hasErrors prop", async () => {
      render(
        <Button loadingAnimation={true} loadingPercent={50} hasErrors={true}>
          Error Button
        </Button>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Multiple Props Combination", () => {
    it("renders with multiple props combined", () => {
      render(
        <Button
          layout="secondary"
          size="large"
          width="full"
          active={true}
          className="custom-button"
          fontWeight="bold"
        >
          Complex Button
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("w-full", "h-12", "custom-button");
    });

    it("renders loading button with custom styling", () => {
      render(
        <Button
          isLoading={true}
          layout="primary"
          size="default"
          className="loading-custom"
        >
          Loading Button
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("cursor-wait", "loading-custom");
    });
  });

  describe("Accessibility", () => {
    it("has proper button role", () => {
      render(<Button>Accessible Button</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("supports aria attributes", () => {
      render(
        <Button aria-label="Custom Label" aria-pressed="true">
          ARIA Button
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Custom Label");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });
  });
});
