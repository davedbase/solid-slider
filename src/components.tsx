import {
  FlowComponent,
  createContext,
  useContext,
  createMemo,
  Component,
  For,
  Show
} from "solid-js";
import { KeenSliderOptions, KeenSliderPlugin } from "keen-slider";
import { createSlider } from "./primitive";

// The following is a hacky way of extracting SliderHelpers
interface Func<T> {
  ([...args]: any, args2?: any): T;
}
export function returnType<T>(func: Func<T>) {
  return {} as T;
}
const sliderValues = returnType(createSlider);

// Main context for the slider
export const SliderContext = createContext(sliderValues);

// Define the accepted props
type SliderProps = {
  options?: KeenSliderOptions;
  plugins?: KeenSliderPlugin[];
};

/**
 * A helpful and simple Provider to wrap your Slider if controls such as SliderButton are used.
 *
 * @param props {KeenSliderOptions} options - Accepts all KeenSlider options.
 * @param props {KeenSLiderPlugin} plugins - A list of Solid Slider or Keen slider plugins.
 */
export const SliderProvider: FlowComponent<SliderProps> = props => {
  const slider = createSlider(props.options || {}, ...(props.plugins || []));
  return <SliderContext.Provider value={slider}>{props.children}</SliderContext.Provider>;
};

/**
 * Main Slider component for specifying the Slider on the page.
 *
 * @param props {KeenSliderOptions} options - Accepts all KeenSlider options.
 * @param props {KeenSLiderPlugin} plugins - A list of Solid Slider or Keen slider plugins.
 */
export const Slider: FlowComponent<SliderProps> = props => {
  console.log("hi");
  let [slider, helpers] = useContext(SliderContext);
  console.log(slider);
  if (!slider) {
    [slider, helpers] = createSlider(props.options || {}, ...(props.plugins || []));
  }
  return (
    <div use:slider class="keen-slider">
      {props.children}
    </div>
  );
};

/**
 * Provides a helpful button with next/prev to pair with your slider.
 *
 * @param props {boolean} next - Specify if this should be a next button.
 * @param props {boolean} prev - Specify if this should be a prev button.
 * @param props {string} class - Class to override the button.
 * @param props {object} classList - List of classes to override the button.
 */
export const SliderButton: FlowComponent<{
  next?: boolean;
  prev?: boolean;
  disabled?: boolean;
  class?: string;
  classList?: { [k: string]: boolean | undefined };
}> = props => {
  const [_, helpers] = useContext(SliderContext);
  const changeSlide = () => helpers[props.next ? "next" : "prev"]();
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

/**
 * An arrow component that binds to the context of the Slider.
 *
 * @param props {boolean} left - Identify the arrow as left.
 * @param props {boolean} right - Identify the arrow as right.
 * @param props {function} onClick - Optional to bind an event to a click of the arrow.
 * @param props {boolean} disabled - Optional property to override the arrow.
 */
export const Arrow: Component<{
  left?: boolean;
  right?: boolean;
  color?: string;
  onClick?: (direction: string) => void;
  disabled?: boolean;
}> = props => {
  const [_, helpers] = useContext(SliderContext);
  const disabled = createMemo(() => {
    if (props.disabled) return true;
    let target = 0;
    if (props.right) target = helpers.slideCount - 1;
    return helpers.current() == target;
  });
  return (
    <button class="keen-slider-arrow" disabled={disabled()}>
      <svg
        onClick={() => {
          if (props.disabled) return;
          props.onClick && props.onClick(props.left ? "left" : "right");
          helpers[props.left ? "prev" : "next"]();
        }}
        classList={{
          left: props.left,
          right: !props.left
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <Show
          fallback={<path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />}
          when={props.left}
        >
          <path
            fill={props.color || "black"}
            d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"
          />
        </Show>
      </svg>
    </button>
  );
};

/**
 * Produces a row of dots represent each of the slides in your Slider.
 *
 * @param props {string} direction - Direction of the arrow.
 * @param props {function} onClick - Bind an event to a click of the arrow.
 * @param props {boolean} disabled - Optional property to override the arrow.
 */
export const Dots: Component<{
  onClick?: (movingTo: number) => void;
  disabled?: boolean;
}> = props => {
  const [_, helpers] = useContext(SliderContext);
  const dots: any = createMemo(() => {
    console.log(helpers.slideCount);
    return new Array(helpers.slideCount);
  });
  return (
    <div class="keen-slider-dots">
      <For each={dots()}>
        {(_, i) => (
          <button
            disabled={props.disabled}
            onClick={() => {
              props.onClick && props.onClick(i());
              helpers.moveTo(i());
            }}
            class={"dot" + (helpers.current() === i() ? " active" : "")}
          />
        )}
      </For>
    </div>
  );
};
