# Solid Slider

A carousel/slider implementation in TypeScript for Solid using KeenSlider. keen-slider is a free library agnostic touch slider with native touch/swipe behavior and great performance. It comes with no dependencies, typescript support, multitouch support and is compatible with all common browsers.

## Installation

```bash
npm install solid-slider --save
yarn add solid-slider ## or in yarn
```

Add as a module:

```ts
import "solid-slider/slider.css";
import createSlider from "solid-slider";
```

## Example

The following is an example of how to create and then bind keen using a directive.

```ts
const MyComponent = props => {
  const options = { duration: 1000 };
  [slider, current, next, prev, moveTo] = createSlider(options);
  return (
    <div use:slider>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </div>
  );
};
```

or without a directive:

```ts
const MyComponent = props => {
  let ref: HTMLElement;
  const options = { duration: 1000 };
  [slider, current, next, prev, moveTo] = createSlider(options);
  onMount(() => {
    slider(ref);
  });
  return (
    <div ref={ref}>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </div>
  );
};
```

## Keen Options API

You can assign options to the slider via parameters. Note that there are other hooks available as well. Only a subset of useful methods are exposed via the primitive although you can access the slider instance as well from the exports to use the methods directly.

- [https://keen-slider.io/api/#options](Options)
- [https://keen-slider.io/api/#event-hooks](Event Hooks)
- [https://keen-slider.io/api/#methods](Methods)
