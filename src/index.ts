import { onMount, onCleanup, createSignal } from "solid-js";
import KeenSlider, { TOptionsEvents } from "keen-slider";

export type SliderOptions = TOptionsEvents;

declare module "solid-js" {
  namespace JSX {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      ["use:slider"]?: {};
    }
  }
}

const createSlider = (options: SliderOptions = {}): [
  create: (el: HTMLElement) => void,
  current: () => number,
  next: () => void,
  prev: () => void,
  moveTo: (id: number, duration?: number) => void,
] => {
  let slider: KeenSlider;
  const [current, setCurrent] = createSignal(0);
  const moveTo = (id: number, duration = 250) => slider.moveToSlide(id, duration);
  const next = () => slider.next();
  const prev = () => slider.prev();
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
    onCleanup(() => slider.destroy());
  };
  return [create, current, next, prev, moveTo];
};

export default createSlider;
