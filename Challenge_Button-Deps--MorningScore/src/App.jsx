import { useState } from "react";
import Button from "./components/Button";

function App() {
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLoadingTest = () => {
    if (!isAnimating) {
      setLoadingPercent((prev) => Math.min(prev + 25, 100));
    }
  };

  const handleResetLoading = () => {
    if (!isAnimating) {
      setLoadingPercent(0);
    }
  };

  return (
    <div className="w-full min-h-dvh bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-purple-600 mb-8">
          Button Component Showcase
        </h1>

        {/* Layout Variations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Layout Variations
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button layout="primary">Primary Button</Button>
            <Button layout="secondary">Secondary Button</Button>
            <Button layout="danger">Danger Button</Button>
            <Button layout="danger-secondary">Danger Secondary</Button>
            <Button layout="green">Green Button</Button>
            <Button layout="borderless">Borderless</Button>
            <Button layout="text">Text Button</Button>
            <Button layout="underline">Underline Button</Button>
          </div>
        </section>

        {/* Size Variations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Size Variations
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="xxsmall">XXSmall</Button>
            <Button size="xsmall">XSmall</Button>
            <Button size="small">Small</Button>
            <Button size="default">Default</Button>
            <Button size="large">Large</Button>
          </div>
        </section>

        {/* Width Variations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Width Variations
          </h2>
          <div className="space-y-4">
            <Button width="default">Default Width</Button>
            <Button width="full">Full Width Button</Button>
            <div className="flex gap-4">
              <Button width="square" size="small">
                S
              </Button>
              <Button width="square" size="default">
                M
              </Button>
              <Button width="square" size="large">
                L
              </Button>
            </div>
          </div>
        </section>

        {/* State Variations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            State Variations
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button>Normal</Button>
            <Button active={true}>Active</Button>
            <Button disabled>Disabled</Button>
            <Button isLoading={true}>Loading</Button>
            <Button hoverEnabled={false}>Hover Disabled</Button>
          </div>
        </section>

        {/* Interactive Loading Animation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Loading Animation
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-700">
                Interactive Progress Demo
              </h3>
              <div className="flex gap-4 items-center">
                <Button
                  loadingAnimation={true}
                  loadingPercent={loadingPercent}
                  fromLoadingPercent={Math.max(0, loadingPercent - 25)}
                  loadingAnimatingCallback={setIsAnimating}
                >
                  Progress: {loadingPercent}%
                </Button>
                <Button onClick={handleLoadingTest} disabled={isAnimating}>
                  Add 25%
                </Button>
                <Button
                  onClick={handleResetLoading}
                  layout="secondary"
                  disabled={isAnimating}
                >
                  Reset
                </Button>
                <span className="text-sm text-gray-600">
                  {isAnimating ? "Animating..." : "Ready"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-700">
                Static Progress Examples
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  loadingAnimation={true}
                  loadingPercent={25}
                  fromLoadingPercent={0}
                >
                  25% Complete
                </Button>
                <Button
                  loadingAnimation={true}
                  loadingPercent={50}
                  fromLoadingPercent={0}
                >
                  50% Complete
                </Button>
                <Button
                  loadingAnimation={true}
                  loadingPercent={75}
                  fromLoadingPercent={0}
                >
                  75% Complete
                </Button>
                <Button
                  loadingAnimation={true}
                  loadingPercent={100}
                  fromLoadingPercent={0}
                >
                  100% Complete
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-700">
                Loading with Error State
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  loadingAnimation={true}
                  loadingPercent={50}
                  fromLoadingPercent={0}
                  hasErrors={true}
                >
                  Error Loading
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Styling */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Custom Styling
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button textColor="red-500">Custom Text Color</Button>
            <Button fontWeight="bold">Bold Text</Button>
            <Button fontWeight="light">Light Text</Button>
            <Button noTransition={true}>No Transition</Button>
            <Button defaultPadding={false} className="px-8">
              Custom Padding
            </Button>
          </div>
        </section>

        {/* Additional Layouts */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">More Layouts</h2>
          <div className="flex flex-wrap gap-4">
            <Button layout="gray">Gray</Button>
            <Button layout="gray-muted">Gray Muted</Button>
            <Button layout="muted">Muted</Button>
            <Button layout="clean">Clean</Button>
            <Button layout="navigation">Navigation</Button>
            <Button layout="stateful">Stateful</Button>
          </div>
        </section>

        {/* Without Button Tag (Span) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Span Elements (withoutButtonTag)
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button withoutButtonTag={true}>Span Primary</Button>
            <Button withoutButtonTag={true} layout="secondary">
              Span Secondary
            </Button>
            <Button withoutButtonTag={true} layout="text">
              Span Text
            </Button>
          </div>
        </section>

        {/* Complex Combinations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Complex Combinations
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button layout="danger" size="large" width="full">
              Large Full-Width Danger
            </Button>
            <Button layout="secondary" size="small" active={true}>
              Small Active Secondary
            </Button>
            <Button
              layout="primary"
              className="shadow-lg hover:shadow-xl"
              fontWeight="bold"
            >
              Custom Styled Primary
            </Button>
          </div>
        </section>

        {/* Icon Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Icon-like Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button width="square">+</Button>
            <Button width="square" layout="secondary">
              -
            </Button>
            <Button width="square" layout="danger">
              ×
            </Button>
            <Button width="square" layout="green">
              ✓
            </Button>
            <Button width="square" layout="text">
              ⋯
            </Button>
          </div>
        </section>

        {/* Accessibility Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Accessibility
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button aria-label="Save document">Save</Button>
            <Button aria-label="Delete item" layout="danger">
              Delete
            </Button>
            <Button aria-pressed="true" active={true}>
              Toggle On
            </Button>
            <Button aria-pressed="false">Toggle Off</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
