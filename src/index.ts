import { on, onMount, createSignal, onCleanup, Accessor, createEffect } from "solid-js";
import KeenSlider, {
  KeenSliderHooks,
  KeenSliderInstance,
  KeenSliderOptions,
  KeenSliderPlugin,
  TrackDetails
} from "keen-slider";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      slider: {};
    }
  }
}

/**
 * Creates a slider powered by KeenSlider.
 *
 * @param {Object} options Values to initialize the slider with
 * @param {Array} plugins Extensions that enhance KeenSlider options
 * @returns {[create: Function, helpers: Object]} Returns mount and helper methods
 * @returns {Function} create Mounts the slider on provided element
 * @returns {Function} helpers.current Current slide number
 * @returns {Function} helpers.current Current slide number
 * @returns {Function} helpers.next Function to trigger the next slide
 * @returns {Function} helpers.prev Function to trigger the previous slide
 * @returns {Function<Object>} helpers.details Provides details about the current slider
 * @returns {Function} helpers.slider Returns the KeenSlider instance
 * @returns {Function} helpers.destroy Manual destroy function
 *
 * @example
 * ```ts
 * const [create, { prev, next }] = createSlider();
 * <div use:slider>...</div>
 * ```
 */
const createSlider = <O = {}, P = {}, H extends string = KeenSliderHooks>(
  options?: KeenSliderOptions<O, P, H> | Accessor<KeenSliderOptions<O, P, H>>,
  ...plugins: KeenSliderPlugin<O, P, H>[]
): [
  create: (el: HTMLElement) => void,
  helpers: {
    current: Accessor<number>;
    next: Accessor<void>;
    prev: Accessor<void>;
    moveTo: (
      id: number,
      duration?: number,
      absolute?: boolean,
      easing?: (t: number) => number
    ) => void;
    details: Accessor<TrackDetails>;
    slider: Accessor<KeenSliderInstance<O, P, H> | undefined>;
    destroy: Accessor<void>;
  }
] => {
  let slider: KeenSliderInstance<O, P, H> | undefined;
  const [current, setCurrent] = createSignal(0);
  const destroy = () => slider && slider.destroy();
  // Slider creation method and directive function
  const create = (el: HTMLElement) => {
    el.classList.add("keen-slider");
    // @ts-ignore
    const opts: Accessor<KeenSliderOptions<O, P, H> | undefined> = () => ({
      selector: el.childNodes,
      ...(typeof options == "function" ? options() : options)
    });
    onMount(() => {
      slider = new KeenSlider<O, P, H>(el, opts(), plugins);
      slider.on("slideChanged", () => setCurrent(slider!.track.details.rel));
      setCurrent(slider!.track.details.rel);
    });
    onCleanup(destroy);
    if (typeof options === "function") {
      createEffect(
        on(
          () => options,
          () => slider && slider.update(opts())
        )
      );
    }
  };
  return [
    create,
    {
      current,
      next: () => slider && slider.next(),
      prev: () => slider && slider.prev(),
      details: () => (slider ? slider.track.details : ({} as TrackDetails)),
      slider: () => slider,
      moveTo: (id: number, duration = 250, absolute = false, easing?: (t: number) => number) =>
        slider?.moveToIdx(id, absolute, { duration, easing: easing }),
      destroy
    }
  ];
};

export default createSlider;
