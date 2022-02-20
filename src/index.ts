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
 * @param {options} Options to initialize the slider with
 * @param {plugins} Plugins that enhance KeenSlider options
 * @returns {Object} An object of useful helpers
 * @returns {create} Register and creation function to call on setup
 * @returns {current} Current slide number
 * @returns {next} Function to trigger the next slide
 * @returns {prev} Function to trigger the previous slide
 * @returns {moveTo} Allow you to change the slider to a specific slide
 * @returns {refresh} Refresh trigger
 * @returns {details} Retrieve a list of SliderDetails
 * @returns {slider} Gain access to the slider itself
 * @returns {destroy} Destroy the entire slider (this is automatically handled)
 *
 * @example
 * ```ts
 * const [create, { prev, next }] = createSlider();
 * <div use:slider>...</div>
 * ```
 */
const createSlider = <
  O = {},
  P = {},
  H extends string = KeenSliderHooks
>(
  options?: KeenSliderOptions<O, P, H>,
  plugins?: KeenSliderPlugin<O, P, H>[]
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
    const opts: Accessor<KeenSliderOptions<O, P, H> | undefined> = () => ({ selector: el.childNodes, ...options });
    onMount(() => {
      slider = new KeenSlider<O, P, H>(el, opts(), plugins);
      slider.on('slideChanged', () => 
        setCurrent(slider!.track.details.rel)
      )
    });
    onCleanup(destroy);
    createEffect(on(() => options, () => slider && slider.update(opts())));
  };
  return [
    create,
    {
      current,
      next: () => slider && slider.next(),
      prev: () => slider && slider.prev(),
      details: () => slider ? slider.track.details : {} as TrackDetails,
      slider: () => slider,
      moveTo: (
        id: number,
        duration = 250,
        absolute = false,
        easing?: (t: number) => number
      ) => slider?.moveToIdx(id, absolute, { duration, easing: easing }),
      destroy
    }
  ];
};

export default createSlider;
