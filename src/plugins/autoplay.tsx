import { makeTimer } from "@solid-primitives/timer";
import { KeenSliderInstance } from "keen-slider";
import { Accessor, createEffect } from "solid-js";

/**
 * Provides an autoplay plugin.
 *
 * @param {number} interval Interval in milliseconds for switching slides
 * @param {object} options Options to customize the autoplay
 * @param {Function} options.pause A pause signal to control the autoplay
 * @param {boolean} options.pauseOnDrag Denotes of the autoplay should pause on drag.
 * @param {object} options.animation Allows for control of duration and easing.
 * @param {number} options.duration Duration for transitioning the slide.
 * @param {number} options.easing Easing function for the transition animation.
 *
 * @example
 * ```ts
 * const [create] = createSlider({}, [autoplay]);
 * ```
 */
export const autoplay = (
  interval: number = 1000,
  options: {
    pause?: Accessor<boolean>;
    pauseOnDrag?: boolean;
    animation?: {
      duration?: number;
      easing?: (t: number) => number;
    };
  },
) => {
  return (slider: KeenSliderInstance) => {
    let dispose: Function;
    const start = () => {
      dispose = makeTimer(
        () =>
          slider.moveToIdx(
            slider.track.details.position + 1,
            true,
            options.animation,
          ),
        interval,
        setInterval,
      );
    };
    // Pause the slider on drag
    if (options.pauseOnDrag !== false) {
      slider.on("dragStarted", () => dispose?.());
    }
    createEffect(() =>
      !options.pause || options.pause() === false ? start() : dispose?.(),
    );
  };
};
