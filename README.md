# Solid Slider

[![size](https://img.shields.io/bundlephobia/minzip/solid-slider?style=for-the-badge)](https://bundlephobia.com/package/solid-slider)
[![size](https://img.shields.io/npm/v/solid-slider?style=for-the-badge)](https://www.npmjs.com/package/solid-slider)
![npm](https://img.shields.io/npm/dw/solid-slider?style=for-the-badge)

A carousel/slider implementation in TypeScript for SolidJS. It's built on Keen-Slider 6, an open-source library agnostic touch slider with native touch/swipe behavior and great performance. It comes with no dependencies, TypeScript support, multitouch support and is compatible with all common browsers.

This package providers both primitive & directive as well as components. You may use either according to your preference. Note that for better SSR support, the component is recommended over the directive.

## Installation

```bash
npm install solid-slider --save
yarn add solid-slider ## or in yarn
```

Import either the directive or component as you'd like:

```ts
import "solid-slider/slider.css";
import { Slider, createSlider } from "solid-slider";
```

## Demo

You can find a functional demo of the slider with most features implemented here: https://codesandbox.io/s/solid-slider-j0x2g

## Plugins

Plugins may be added directly via the createSlider primitive. You may add a Keen-Slider plugin directly or built-in plugins shipped with this package. Currently an autoplay plugin is available that will assist with autoplaying actions in the slider. Simply add the plugins after the options parameter. Please feel free to post requests for additional plugins or submit PRs if you decide to improve the base functionality. Some ideas for additional plugins include:

- Slider nav (dot, arrow controls even thumbnails)
- Lazy loaded images
- Slide transitions

Details on applying plugins are available for each use below.

## Use as Component

The following is an example of how to use the component.

```tsx
const MyComponent = () => {
  return (
    <Slider options={{ loop: true }}>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </Slider>
  );
};
```

You may also use the next and previous button. Note that you must wrap your `Slider` with `SliderProvider`.

```tsx
const MyComponent = () => {
  return (
    <SliderProvider>
      <Slider options={{ loop: true }}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Slider>
      <SliderButton prev>Previous</SliderButton>
      <SliderButton next>Next</SliderButton>
    <SliderProvider>
  );
};
```

### Autoplay Plugin

You may include the autoplay plugin by providing it as a prop:

```tsx
import createSlider from "solid-slider";
import autoplay from "solid-slider/plugins/autoplay";

const MyComponent = () => {
  return (
    <Slider options={{ loop: true }} plugins={[autoplay(1500, {})]}>
      <div class="slide1">1</div>
      <div class="slide2">2</div>
      <div class="slide3">3</div>
      <div class="slide4">4</div>
      <div class="slide5">5</div>
      <div class="slide6">6</div>
    </Slider>
  );
};
```

## Use as Primitive

The following is an example of how to create and then bind options using a directive.

```tsx
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

```tsx
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

### Autoplay

The autoplay function extends the slider with pausable playing. You can even supply a signal to control toggling autoplay. [Click here](https://codesandbox.io/s/solid-slider-autoplay-plugin-h2wphk?file=/src/index.tsx) for a demo of autoplay.

```ts
import createSlider from "solid-slider";
import autoplay from "solid-slider/plugins/autoplay";

const [pause, togglePause] = createSignal(false);
const [slider] = createSlider(
  { loop: true },
  autoplay(2000, {
    pause,
    pauseOnDrag: true
  })
);
```

## Implementation

Solid Slider is meant to be a lightweight and compact wrapper of Keen-Slider. It exposes helpers to make working with the slider convenient. Note that the when the slider mounts it assumes all children in the el are slides. You can override this functionality by passing in a "selector" value to target the specific slides you'd like to include.

Thie library exports it's own CSS which is the basic Keen-Slider implementation for convenience. If you supply options as an accessor function, the slider will reactively update the configuration so that you don't have to destroy and recreate the slider. As of Keen-Slider 6 plugins are now fully supported. You may supply them as a param in createSlider. Note that plugins are not reactively updated and must be supplied on creation.

## Roadmap

- [ ] Create [adaptiveHeight](https://codesandbox.io/s/github/rcbyr/keen-slider-sandboxes/tree/v6/misc/adaptive-height/react?file=/src/App.js:191-403) plugin
- [ ] Add Dots components (to display a row of dots below the slider)
- [ ] Add slider thumbnail navigation
- [ ] Add slider loader
- [ ] Build [timepicker](https://keen-slider.io/examples#timepicker) component
- [ ] Create [Scroll Wheel](https://keen-slider.io/examples#scroll-wheel-controls) component

## Changelog

- 1.0.0 - Initial release
- 1.0.3 - Changed the exported API to be slightly more flexible.
- 1.1.1 - Upgraded to Keen-Slider 6 and improved general reactivity.
- 1.2.5 - Added autoplay plugin and general plugin structure.
- 1.2.7 - Maybe I should actually export the .css? That'd be a good idea, right? /s
- 1.2.9 - Updated timer primitive and patched issue with current slide setting from initial options.
- 1.3.1 - Introduced Slider, SliderProvider and SliderButton for ease.
- 1.3.2 - Patched issue with initial slide not setting current signal.
- 1.3.5 - Updated to latest SolidJS version.
- 1.3.7 - Fixed TS issues updated to latest KeenSlider.
- 1.3.8 - Updated to Solid 1.5

## Keen Options API

You can set options to the slider via parameters. Note that there are other hooks available as well. Only a subset of useful methods are exposed via the primitive although you can access the slider instance as well from the exports to use the methods directly.

- [Options](https://keen-slider.io/api/#options)
- [Event Hooks](https://keen-slider.io/api/#event-hooks)
- [Methods](https://keen-slider.io/api/#methods)
