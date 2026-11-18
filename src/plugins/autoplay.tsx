import { makeTimer } from "@solid-primitives/timer";
import { KeenSliderInstance } from "keen-slider";
import { Accessor, createEffect, onCleanup } from "solid-js";

/**
 * Provides an autoplay plugin.
 *
 * Call this from within a component (or other reactive owner) so the pause
 * signal is tracked and the timer is cleaned up with it.
 *
 * @param interval - Interval in milliseconds for switching slides
 * @param options - Options to customize the autoplay
 * @param options.pause - A pause signal to control the autoplay
 * @param options.pauseOnDrag - Denotes of the autoplay should pause on drag.
 * @param options.animation - Allows for control of duration and easing.
 * @param options.duration - Duration for transitioning the slide.
 * @param options.easing - Easing function for the transition animation.
 *
 * @example
 * ```ts
 * const [create] = createSlider({}, autoplay(1000, {}));
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
  } = {},
) => {
  let slider: KeenSliderInstance | undefined;
  let dispose: (() => void) | undefined;
  let paused = false;
  const stop = () => {
    dispose?.();
    dispose = undefined;
  };
  const start = () => {
    stop();
    dispose = makeTimer(
      () =>
        slider!.moveToIdx(
          slider!.track.details.position + 1,
          true,
          options.animation,
        ),
      interval,
      setInterval,
    );
  };
  const sync = () => {
    if (!slider) return;
    paused ? stop() : start();
  };
  // Reactive pieces are created here, in the caller's owner. Plugins are
  // invoked by KeenSlider outside any owner, so they must not create them.
  createEffect(
    () => !!options.pause && options.pause() !== false,
    (isPaused) => {
      paused = isPaused;
      sync();
    },
  );
  onCleanup(stop);
  return (instance: KeenSliderInstance) => {
    slider = instance;
    // Pause the slider on drag
    if (options.pauseOnDrag !== false) {
      slider.on("dragStarted", stop);
    }
    slider.on("created", sync);
    slider.on("destroyed", stop);
  };
};
