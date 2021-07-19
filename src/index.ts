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
 * @returns [create] Register and creation function to call on setup
 * @returns [current] Current slide number
 * @returns [next] Function to trigger the next slide
 * @returns [prev] Function to trigger the previous slide
 * @returns [moveTo] Identifies which
 * 
 * @example
 * ```ts
 * const [create, clear] = createSlider();
 * <div use:slider>...</div>
 * ```
 */
const createSlider = (options: SliderOptions = {}): [
  create: (el: HTMLElement) => void,
  current: () => number,
  next: () => void,
  prev: () => void,
  moveTo: (id: number, duration?: number) => void,
  resize: () => void,
  refresh: () => void,
  details: () => SliderDetails,
  slider: () => KeenSlider,
  destroy: () => void,
] => {
  let slider: KeenSlider;
  const [current, setCurrent] = createSignal(0);
  const destroy = () => slider && slider.destroy();
  const create = (el: HTMLElement) => {
    let opts = {...options};
    // @ts-ignore
    opts.slides = el.childNodes;
    opts.afterChange = (instance) => {
      options.afterChange && options.afterChange(instance);
      setCurrent(instance.details().relativeSlide);
    };
    el.classList.add('keen-slider');
    onMount(() => slider = new KeenSlider(el, opts));
    onCleanup(destroy);
  };
  return [
    create,
    current,
    () => slider.next(),
    () => slider.prev(),
    (id: number, duration = 250) => slider.moveToSlide(id, duration),
    () => slider.resize(),
    () => slider.refresh(),
    () => slider.details(),
    () => slider,
    destroy
  ];
};

export default createSlider;
