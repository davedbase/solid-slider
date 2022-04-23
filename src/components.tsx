import { Component, createContext, useContext, createSignal, createMemo } from "solid-js";
import { createSlider } from "./primitive";
import { KeenSliderOptions, KeenSliderPlugin } from "keen-slider";
import { isServer } from "solid-js/web";

// The following is a hacky way of extracting SliderHelpers
interface Func<T> {
  ([...args]: any, args2?: any): T;
}
export function returnType<T>(func: Func<T>) {
  return {} as T;
}
const sliderValues = returnType(createSlider);
type SliderHelpers = typeof sliderValues[1];

// Main context for the slider
export const SliderContext = createContext(createSignal<SliderHelpers | null>(null));

/**
 * A helpful and simple Provider to wrap your Slider if controls such as SliderButton are used.
 *
 * @param props {KeenSliderOptions} options - Accepts all KeenSlider options.
 * @param props {KeenSLiderPlugin} plugins - A list of Solid Slider or Keen slider plugins.
 */
export const SliderProvider: Component = props => (
  <SliderContext.Provider value={createSignal(null)}>{props.children}</SliderContext.Provider>
);

/**
 * Main Slider component for specifying the Slider on the page.
 *
 * @param props {KeenSliderOptions} options - Accepts all KeenSlider options.
 * @param props {KeenSLiderPlugin} plugins - A list of Solid Slider or Keen slider plugins.
 */
export const Slider: Component<{
  options?: KeenSliderOptions;
  plugins?: KeenSliderPlugin[];
}> = props => {
  if (isServer) return props.children;
  const [, setHelpers] = useContext(SliderContext);
  const [slider, helpers] = createSlider(props.options || {}, ...(props.plugins || []));
  setHelpers(helpers);
  slider;
  return <div use:slider>{props.children}</div>;
};

/**
 * Provides a helpful button with next/prev to pair with your slider.
 *
 * @param props {boolean} next - Specify if this should be a next button.
 * @param props {boolean} prev - Specify if this should be a prev button.
 * @param props {string} class - Class to override the button.
 * @param props {object} classList - List of classes to override the button.
 */
export const SliderButton: Component<{
  next?: boolean;
  prev?: boolean;
  disabled?: boolean;
  class?: string;
  classList?: { [k: string]: boolean | undefined };
}> = props => {
  const context = useContext(SliderContext);
  const changeSlide = () => {
    if (context == null) return;
    const [helpers] = context;
    props.next ? helpers()?.next() : helpers()?.prev();
  };
  return (
    <button
      disabled={props.disabled || false}
      class={props.class}
      classList={props.classList}
      onClick={changeSlide}
    >
      {props.children}
    </button>
  );
};
