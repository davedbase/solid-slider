import { onMount, onCleanup, createSignal } from "solid-js";
import KeenSlider, { TOptionsEvents, TDetails } from "keen-slider";

export type SliderOptions = TOptionsEvents;
export type SliderDetails = TDetails;

declare module "solid-js" {
  namespace JSX {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      ["use:slider"]?: {};
    }
  }
}

/**
 * Creates a slider powered by KeenSlider.
 *
 * @param {options} Options to initialize the slider with
 * @returns {Array} An array of useful utilities
 * @returns [create] Register and creation function to call on setup
 * @returns [current] Current slide number
 * @returns [next] Function to trigger the next slide
 * @returns [prev] Function to trigger the previous slide
 * @returns [moveTo] Allow you to change the slider to a specific slide
 * @returns [refresh] Refresh trigger
 * @returns [details] Retrieve a list of SliderDetails
 * @returns [slider] Gain access to the slider itself
 * @returns [destroy] Destroy the entire slider (this is automatically handled)
 *
 * @example
 * ```ts
 * const [create] = createSlider();
 * <div use:slider>...</div>
 * ```
 */
const createSlider = (
  options: SliderOptions = {}
): [
  (el: HTMLElement) => void,
  {
    current: () => number;
    next: () => void;
    prev: () => void;
    moveTo: (id: number, duration?: number) => void;
    resize: () => void;
    refresh: () => void;
    details: () => SliderDetails;
    slider: () => KeenSlider;
    destroy: () => void;
  }
] => {
  let slider: KeenSlider;
  const [current, setCurrent] = createSignal(0);
  const destroy = () => slider && slider.destroy();
  const create = (el: HTMLElement) => {
    let opts = { ...options };
    // @ts-ignore
    opts.slides = el.childNodes;
    opts.slideChanged = instance => {
      options.slideChanged && options.slideChanged(instance);
      setCurrent(instance.details().relativeSlide);
    };
    el.classList.add("keen-slider");
    onMount(() => (slider = new KeenSlider(el, opts)));
    onCleanup(destroy);
  };
  return [
    create,
    {
      current,
      next: () => slider.next(),
      prev: () => slider.prev(),
      moveTo: (id: number, duration = 250) => slider.moveToSlide(id, duration),
      resize: () => slider.resize(),
      refresh: () => slider.refresh(),
      details: () => slider.details(),
      slider: () => slider,
      destroy
    }
  ];
};

export default createSlider;
