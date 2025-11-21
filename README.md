# Challenge Button Deps - MorningScore

Button React component refactoring challenge.

This is a refactor challenge that need to refactoring a React Button Component.
This Component has some potential issues.

## The requirement (Problem statement)

1. Highlight the potential issues that need to fix/avoid/refactoring.
2. Make a draft that solve those issues.

## The resource

- The button component that need to refactoring: [Button.js](./ChallengeSource/Button%20deps/Button.js)
- The important hook: [use-button-layout-map.js](./ChallengeSource/Button%20deps/partials/use-button-layout-map.js)
- The rest of the dependencies can be found on the NPM.

## The referrences

During the challenge, the resource code has been split into mutiple files. Here is the list:

- hooks:
  - [use-button-layout-map.js](./Challenge_Button-Deps--MorningScore/src/hooks/use-button-layout-map.js) Resource offered hooks.
  - [use-mouse-actions.js](./Challenge_Button-Deps--MorningScore/src/hooks/use-mouse-actions.js) Included the moveMegnet, moveOut, and enterAndOut function.
- lib:
  - [util.js](./Challenge_Button-Deps--MorningScore/src/lib/util.js) The style mapping functions.
- components:
  - [Button.js](./Challenge_Button-Deps--MorningScore/src/components/Button.jsx) The Button component after refactoring.
  - [Button.test.js](./Challenge_Button-Deps--MorningScore/src/components/Button.test.jsx) The AI generate test cases.
  - [ErrorViewTemplateSmall.jsx](./Challenge_Button-Deps--MorningScore/src/components/ErrorViewTemplateSmall.jsx) The self made templrary component.
  - [Widget.jsx](./Challenge_Button-Deps--MorningScore/src/components/Widget.jsx) The self made templrary component.
- [App.js](./Challenge_Button-Deps--MorningScore/src/App.jsx) The AI generate show case.

## The declearation and AI usage

Based on the callenge purpose, I have been restrained to use the Ai assitent to finish the challenge. But there are necessary to declear that where I used it to get the help.

1. English gramma correction.
2. Generate the test cases at the begining of the challenge. The good refacoting can not leave with the full test. Therefore I require the AI to make the test for button.js . That should not be the full test implementation, but only offer a overview test as a instrance.
3. Generate the show cases in the APP.js . Then that will easy to see the really stylling shows with the button.
4. Document research. During the challenge, the gsap package was a new thing to me. So, some of the usage in the code that I need do the research. I asked AI to quick get the explanation.

## How to start

### Excute the code

1. Navigete into Challenge_Button-Deps--MorningScore and run `npm i`.
2. For start the project and see the UI display in the browser, run `npm run dev`.
3. For the component test, run `npm run test`.

### Read the analysis based on the resouce

I have made the comment that analysis the resource code. Please read the comment in [button.js](./Button%20deps/Button.js).

### Check the refactoring result

The refactoring result is in [Button Component](./Challenge_Button-Deps--MorningScore/src/components/Button.jsx)
