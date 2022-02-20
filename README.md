# <img width="27px" src="https://github.com/solidjs/solid-site/raw/master/src/assets/logo.png" alt="Solid logo"> &nbsp;Solid Slider

A carousel/slider implementation in TypeScript for Solid using KeenSlider. keen-slider is a free library agnostic touch slider with native touch/swipe behavior and great performance. It comes with no dependencies, typescript support, multitouch support and is compatible with all common browsers.

## Installation

```bash
npm install solid-slider --save
yarn add solid-slider ## or in yarn
```

Add as a module:

```ts
import "solid-slider/dist/slider.css";
import createSlider from "solid-slider";
```

## Demo

You can find a functional demo of the slider with most features implemented here: https://codesandbox.io/s/solid-slider-j0x2g

## Example

The following is an example of how to create and then bind options using a directive.

```ts
const MyComponent = () => {
  const options = { duration: 1000 };
  const [slider, { current, next, prev, moveTo }] = createSlider(options);
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
const MyComponent = () => {
  let ref: HTMLElement;
  const options = { duration: 1000 };
  const [slider, { current, next, prev, moveTo }] = createSlider(options);
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

## Changelog

- 1.0.0 - Initial release
- 1.0.3 - Changed the exported API to be slightly more flexible.
- 1.1.0 - Upgraded to KeenSlider 6 and improved general reactivity.

## Keen Options API

You can set options to the slider via parameters. Note that there are other hooks available as well. Only a subset of useful methods are exposed via the primitive although you can access the slider instance as well from the exports to use the methods directly.

- [Options](https://keen-slider.io/api/#options)
- [Event Hooks](https://keen-slider.io/api/#event-hooks)
- [Methods](https://keen-slider.io/api/#methods)
