import {
  on,
  onMount,
  createSignal,
  onCleanup,
  Accessor,
  createEffect,
} from "solid-js";
import { access } from "@solid-primitives/utils";
import KeenSlider, {
  KeenSliderHooks,
  KeenSliderInstance,
  KeenSliderOptions,
  KeenSliderPlugin,
  TrackDetails,
} from "keen-slider";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      slider: {};
      thumbSlider: {};
    }
  }
}

export type SliderControls<O, P, H extends string> = [
  create: (el: HTMLElement) => void,
  helpers: {
    current: Accessor<number>;
    next: VoidFunction;
    prev: VoidFunction;
    moveTo: (
      id: number,
      duration?: number,
      absolute?: boolean,
      easing?: (t: number) => number,
    ) => void;
    details: () => TrackDetails;
    slider: () => KeenSliderInstance<O, P, H> | undefined;
    destroy: VoidFunction;
    update: VoidFunction;
  },
];

/**
 * Creates a slider powered by KeenSlider.
 *
 * @param options - Values to initialize the slider with
 * @param plugins - Extensions that enhance KeenSlider options
 * @returns Returns mount and helper methods
 * @returns create - Mounts the slider on provided element
 * @returns helpers.current - Current slide number
 * @returns helpers.next - Function to trigger the next slide
 * @returns helpers.prev - Function to trigger the previous slide
 * @returns helpers.details - Provides details about the current slider
 * @returns helpers.slider - Returns the KeenSlider instance
 * @returns helpers.destroy - Manual destroy function
 *
 * @example
 * ```ts
 * const [create, { prev, next }] = createSlider();
 * <div use:slider>...</div>
 * ```
 */
export const createSlider = <
  O = {},
  P = {},
  H extends string = KeenSliderHooks,
>(
  options?: KeenSliderOptions<O, P, H> | Accessor<KeenSliderOptions<O, P, H>>,
  ...plugins: KeenSliderPlugin<O, P, H>[]
): SliderControls<O, P, H> => {
  let slider: KeenSliderInstance<O, P, H> | undefined;
  let el: HTMLElement;
  const opts = () => access(options);
  const [current, setCurrent] = createSignal((opts() as any)?.initial || 0);
  const destroy = () => slider && slider.destroy();
  const getOptions = (overrides = {}): KeenSliderOptions<O, P, H> => {
    const baseOpts = opts();
    return {
      selector: el.childNodes,
      ...(baseOpts || {}),
      ...overrides,
    } as KeenSliderOptions<O, P, H>;
  };
  const update = () => slider?.update(getOptions());
  // Slider creation method and directive function
  const create = (newEl: HTMLElement) => {
    el = newEl;
    el.classList.add("keen-slider");
    onMount(() => {
      slider = new KeenSlider<O, P, H>(el, getOptions(), plugins);
      slider.on("slideChanged", () => setCurrent(slider!.track.details.rel));
    });
    onCleanup(destroy);
    if (typeof options === "function") {
      createEffect(on(() => options, update));
    }
  };
  const moveTo = (
    id: number,
    duration = 250,
    absolute = false,
    easing?: (t: number) => number,
  ) => {
    slider?.moveToIdx(id, absolute, { duration, easing: easing });
  };
  return [
    create,
    {
      current,
      next: () => slider && slider.next(),
      prev: () => slider && slider.prev(),
      details: () => (slider ? slider.track.details : ({} as TrackDetails)),
      slider: () => slider,
      moveTo,
      destroy,
      update,
    },
  ];
};
