import React, { useMemo } from 'react';

export default function useButtonLayoutMap(textColor, hoverEnabled) {
  return useMemo(() => {
  // Initial layout mapping
    const layout = {
      underline: {
        false: [
          'bg-transparent',
          { 'text-purple-500 hover:text-purple-300 underline': !textColor },
          'border-none',
        ],
        true: [
          'bg-transparent',
          { 'text-purple hover:text-purple-400 underline': !textColor },
          'border-none',
        ],
      },
      primary: {
        false: [
          'bg-purple-500 hover:bg-purple-200 active:bg-purple-500 disabled:opacity-50 disabled:pointer-events-none',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
        true: [
          'bg-purple-500 hover:bg-purple-200 active:bg-purple-500',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
      },
      'primary-no-anim': {
        false: [
          'bg-purple-500 hover:bg-purple-200 active:bg-purple-500 disabled:opacity-50 disabled:pointer-events-none',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
        true: [
          'bg-purple-500 hover:bg-purple-200 active:bg-purple-500 disabled:opacity-50',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
      },
      secondary: {
        false: [
          'bg-white hover:bg-purple-500 hover:text-white',
          { 'text-purple-500 disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-purple-500',
        ],
        true: [
          'bg-purple-500',
          { 'text-white': !textColor },
          'border border-purple',
        ],
      },
      'secondary-muted': {
        false: [
          'bg-white hover:bg-tabshover',
          { 'text-purple-500 disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-gray-300',
        ],
        true: [
          'bg-white',
          { 'text-purple-500': !textColor },
          'border border-purple',
        ],
      },
      'secondary-serene': {
        false: [
          'bg-serene-gray hover:bg-purple-500 hover:text-white',
          { 'text-purple-500 disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-serene-gray',
        ],
        true: [
          'bg-purple-500',
          { 'text-white': !textColor },
          'border border-purple',
        ],
      },
      filter: {
        false: [
          'bg-white hover:bg-tabshover',
          { 'text-purple-700 disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-gray-300',
        ],
        true: [
          'bg-white',
          { 'text-purple-700': !textColor },
          'border border-purple-700',
        ],
      },
      gray: {
        false: [
          'bg-white',
          { 'text-secondary disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-gray-300 hover:border-purple',
        ],
        true: [
          'bg-white',
          { 'text-primary': !textColor },
          'border border-purple',
        ],
      },
      'gray-muted': {
        false: [
          'bg-white hover:bg-tabshover',
          { 'text-secondary disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-gray-300',
        ],
        true: [
          'bg-white',
          { 'text-secondary': !textColor },
          'border border-gray-300',
        ],
      },
      stateful: {
        false: [
          'bg-white hover:bg-gray-100 active:bg-gray-200',
          { 'text-secondary disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-gray-300 hover:gray-600',
        ],
        true: [
          'bg-white hover:bg-gray-100 active:bg-gray-200',
          { 'text-primary-600 disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-gray-300 hover:gray-600',
        ],
      },
      danger: {
        false: [
          'bg-red-500 hover:bg-red-200 active:bg-red-500 disabled:opacity-50 disabled:pointer-events-none',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border-transparent',
        ],
        true: [
          'bg-red-500 hover:bg-red-200 active:bg-red-500',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border-transparent',
        ],
      },
      'danger-secondary': {
        false: [
          'bg-white hover:bg-red-500 hover:text-white',
          { 'text-red-500 disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-red-500',
        ],
        true: [
          'bg-red-500',
          { 'text-white': !textColor },
          'border border-purple',
        ],
      },
      'danger-outline': {
        false: [
          'bg-white hover:bg-red active:bg-red disabled:opacity-50 disabled:pointer-events-none',
          { 'text-red hover:text-white active:text-white': !textColor },
          'border-red border',
        ],
        true: [
          'bg-white hover:bg-red active:bg-red disabled:opacity-50 disabled:pointer-events-none',
          { 'text-red hover:text-white active:text-white': !textColor },
          'border-red border',
        ],
      },
      borderless: {
        false: [
          'bg-transparent',
          { 'text-secondary hover:text-purple active:text-purple-300 disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border-none',
        ],
        true: [
          'bg-transparent',
          { 'text-secondary hover:text-purple active:text-purple-300': !textColor },
          'border-none',
        ],
      },
      navigation: {
        false: [
          'bg-transparent',
          { 'text-purple-700 hover:text-purple active:text-purple-300 disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border-none',
        ],
        true: [
          'bg-transparent',
          { 'text-purple-700 hover:text-purple active:text-purple-300': !textColor },
          'border-none',
        ],
      },
      text: {
        false: [
          'bg-transparent',
          { 'text-purple hover:text-purple-600 active:text-purple-700 disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border-none',
        ],
        true: [
          'bg-transparent',
          { 'text-purple hover:text-purple-600 active:text-purple-700': !textColor },
          'border-none',
        ],
      },
      clean: {
        false: [
          'bg-transparent hover:bg-tabshover hover:text-purple-700 border border-transparent',
          { 'text-purple-500 disabled:opacity-50 disabled:pointer-events-none': !textColor },
          '',
        ],
        true: [
          'bg-transparent',
          { 'text-purple-700': !textColor },
        ],
      },
      muted: {
        false: [
          'bg-gray-100 hover:bg-gray-200',
          { 'text-primary disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-transparent',
        ],
        true: [
          'bg-gray-100',
          { 'text-purple-500': !textColor },
          'border border-purple-500',
        ],
      },
      circleso: {
        false: [
          'bg-circleso hover:opacity-50 disabled:opacity-25 disabled:pointer-events-none',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
        true: [
          'bg-circleso hover:opacity-50 disabled:opacity-25 disabled:pointer-events-none',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
      },
      fiverr: {
        false: [
          'bg-fiverr hover:opacity-50 disabled:opacity-25 disabled:pointer-events-none',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
        true: [
          'bg-fiverr hover:opacity-50 disabled:opacity-25 disabled:pointer-events-none',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
      },
      toast: {
        false: [
          'bg-transparent hover:bg-white hover:text-purple',
          { 'text-white disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-white',
        ],
        true: [
          'bg-white',
          { 'text-purple': !textColor },
          '',
        ],
      },
      none: {
        false: [],
        true: [],
      },
      green: {
        false: [
          'bg-green-500 hover:bg-green-200 active:bg-green-500 disabled:opacity-50 disabled:pointer-events-none',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
        true: [
          'bg-green-500 hover:bg-green-200 active:bg-green-500',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
      },
      'ai-badge': {
        false: [
          'inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-gradient-to-b from-purple-700 to-purple-500 hover:shadow-ai-badge-hover disabled:opacity-50 disabled:pointer-events-none',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
        true: [
          'inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-gradient-to-b from-purple-700 to-purple-500 shadow-ai-badge-hover',
          { 'text-white hover:text-white active:text-white': !textColor },
          'border border-transparent',
        ],
      },
      'ai-serene': {
        false: [
          'bg-serene-gray hover:bg-purple-500 rounded-full  hover:text-white',
          { 'text-purple-500 disabled:opacity-50 disabled:pointer-events-none': !textColor },
          'border border-serene-gray',
        ],
        true: [
          'bg-purple-500 rounded-full ',
          { 'text-white': !textColor },
          'border border-purple',
        ],
      },
    };

    // Utility function to remove hover classes from a CSS string.
    const removeHoverClasses = (css) => css
      .split(' ')
      .filter((token) => !token.startsWith('hover:'))
      .join(' ');

    // If hover is disabled, walk through the layout and remove hover classes.
    if (!hoverEnabled) {
    // This helper recursively processes each value.
      const processValue = (value) => {
        if (typeof value === 'string') {
          return removeHoverClasses(value);
        }
        if (Array.isArray(value)) {
          return value.map(processValue);
        }
        if (typeof value === 'object' && value !== null) {
          const newObj = {};
          for (const key in value) {
            if (Object.hasOwnProperty.call(value, key)) {
              // Remove hover classes from the key while keeping its boolean condition intact.
              const newKey = removeHoverClasses(key);
              newObj[newKey] = value[key];
            }
          }
          return newObj;
        }
        return value;
      };

      for (const buttonType in layout) {
        if (Object.hasOwnProperty.call(layout, buttonType)) {
          for (const state in layout[buttonType]) {
            if (Object.hasOwnProperty.call(layout[buttonType], state)) {
              layout[buttonType][state] = layout[buttonType][state].map(processValue);
            }
          }
        }
      }
    }

    return layout;
  }, [hoverEnabled, textColor]);
}
