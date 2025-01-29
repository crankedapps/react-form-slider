# react-form-slider

This is a coding exercise I was required to do for a job application.  See [/public/frontend_exercise.pdf](/public/frontend_exercise.pdf) for the challenge's instructions.  Basically, they wanted a custom slider in React not using native HTML range input or any 3rd party dependencies.  I was also not supposed to spend more than 2 hours.

## Usage
### Component Example
``` html
<Slider
  min={min}
  max={max}
  width={width}
  value={value}
  onValueChanged={setValue}
  onDrag={setDragValue}
  onDraggingStateChanged={setIsDragging}
/>
```
### Properties
Property | Type | Default | Description
--- | --- | --- | ---
`min` | `number` | `0` | Minimum range of slider
`max` | `number` | `100` | Maximum range of slider
`width` | `string` | `100%` | Width of slider container.  Must be a percentage (`%`) or pixel (`px`) CSS value.
`value` | `number` | `0` | Value of slider
`onValueChanged` | `func` | `undefined` | `(value: number) => void` where `value` is the updated value when slider handle drag stops (mouse up or touch end).
`onDrag` | `func` | `undefined` | `(value: number) => void` where `value` is the updated value emitted while slider handle is actively being dragged.
`onDraggingStateChanged` | `func` | `undefined` | `(value: boolean) => void` where `value` is the state if user is dragging slider handle (true is dragging, false is not).

## Run
* Clone repository to your local system
* Run `npm i`
* Run `npm run dev`

## My Challenge Feedback / Notes
* The challenge didn't mention any `step` property which I think is essential to any slider or else you are just calculating based on handle position within the slider bar, so depending on slider's range and pixel position of slider handle it could calculate to an obscure number such as 52.0030499. So, I added the property (as optional) to make for prettier numbers and better user experience.
* The challenge required a `width` property - although I implemented this as requested, I don't necessarily agree with this philosophy.  I think it's mostly standard in primitive UI component libraries for the form controls fill the width of their container.  That styling should come from the parent component using a container element which the child form control component is a descendant of.
* I exceeded the two-hour time limit by a bit as I had to brush up on React (been in the Angular ecosystem the last 8 years).  I am confident I could easily step into using React as a daily driver, but my past experiences have been limited to mostly just use with Gatsby and some tutorials here and there.


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
