import {
  createContext,
  useContext,
  createSignal,
  FlowComponent,
  Component,
  createEffect,
  Show,
  createMemo,
  For,
  onSettled,
} from "solid-js";
import { access } from "@solid-primitives/utils";
import { isServer } from "@solidjs/web";
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
type SliderHelpers = (typeof sliderValues)[1];

// Main context for the slider
export const SliderContext = createContext(
  createSignal<SliderHelpers | null>(null),
);

/**
 * A helpful and simple Provider to wrap your Slider if controls such as SliderButton are used.
 *
 * @param props.options - Accepts all KeenSlider options.
 * @param props.plugins - A list of Solid Slider or Keen slider plugins.
 */
export const SliderProvider: FlowComponent = (props) => (
  <SliderContext value={createSignal<SliderHelpers | null>(null)}>
    {props.children}
  </SliderContext>
);

/**
 * Main Slider component for specifying the Slider on the page.
 *
 * @param props.options - Accepts all KeenSlider options.
 * @param props.plugins - A list of Solid Slider or Keen slider plugins.
 */
export const Slider: FlowComponent<{
  options?: KeenSliderOptions;
  plugins?: KeenSliderPlugin[];
}> = (props) => {
  if (isServer) return <div class="keen-slider">{props.children}</div>;
  const [, setHelpers] = useContext(SliderContext);
  const [slider, helpers] = createSlider(
    props.options || {},
    ...(props.plugins || []),
  );
  // Registered after createSlider's own onSettled, so the KeenSlider instance
  // exists by the time consumers see the helpers.
  onSettled(() => {
    setHelpers(helpers);
  });
  createEffect(
    () => access(props.children),
    () => queueMicrotask(() => helpers.update()),
    { defer: true },
  );
  return (
    <div ref={slider} class="keen-slider">
      {props.children}
    </div>
  );
};

/**
 * Provides a helpful button with next/prev to pair with your slider.
 *
 * @param props.next - Specify if this should be a next button.
 * @param props.prev - Specify if this should be a prev button.
 * @param props.class - Class to override the button.
 * @param props.classList - List of classes to override the button.
 */
export const SliderButton: FlowComponent<{
  next?: boolean;
  prev?: boolean;
  disabled?: boolean;
  class?: string;
  classList?: { [k: string]: boolean | undefined };
}> = (props) => {
  const context = useContext(SliderContext);
  const changeSlide = () => {
    if (context == null) return;
    const [helpers] = context;
    props.next ? helpers()?.next() : helpers()?.prev();
  };
  return (
    <button
      disabled={props.disabled || false}
      class={[props.class, props.classList]}
      onClick={changeSlide}
    >
      {props.children}
    </button>
  );
};

/**
 * Navigation dots component for the slider.
 * Displays a dot for each slide and highlights the current slide.
 *
 * @param props.class - Class to override the dots container.
 * @param props.classList - List of classes to override the dots container.
 * @param props.dotClass - Class to override individual dots.
 * @param props.dotClassList - List of classes to override individual dots.
 *
 * @example
 * ```tsx
 * <SliderProvider>
 *   <Slider>
 *     <div class="keen-slider__slide">Slide 1</div>
 *     <div class="keen-slider__slide">Slide 2</div>
 *   </Slider>
 *   <SliderDots />
 * </SliderProvider>
 * ```
 */
export const SliderDots: Component<{
  class?: string;
  classList?: { [k: string]: boolean | undefined };
  dotClass?: string;
  dotClassList?: { [k: string]: boolean | undefined };
}> = (props) => {
  const context = useContext(SliderContext);
  const [slideCount, setSlideCount] = createSignal(0);

  const handleDotClick = (idx: number) => {
    if (context == null) return;
    const [helpers] = context;
    helpers()?.moveTo(idx);
  };

  // Update slide count when slider is created/updated
  createEffect(
    () => (context ? context[0]()?.slider() : undefined),
    (sliderInstance) => {
      if (sliderInstance) {
        const updateCount = () => {
          const details = sliderInstance.track.details;
          setSlideCount(details?.slides?.length || 0);
        };

        // Set initial count
        updateCount();

        // Listen for slider changes
        sliderInstance.on("created", updateCount);
        sliderInstance.on("updated", updateCount);
      }
    },
  );

  const slides = createMemo(() =>
    Array.from({ length: slideCount() }, (_, i) => i),
  );

  return (
    <Show when={context != null}>
      <div class={[props.class || "keen-slider-dots", props.classList]}>
        <For each={slides()} keyed={false}>
          {(idx) => {
            const [helpers] = context!;
            const isActive = () => helpers()?.current() === idx();
            return (
              <button
                class={[
                  props.dotClass || "keen-slider-dot",
                  props.dotClassList,
                  { active: isActive() },
                ]}
                onClick={() => handleDotClick(idx())}
                aria-label={`Go to slide ${idx() + 1}`}
              />
            );
          }}
        </For>
      </div>
    </Show>
  );
};

/**
 * Thumbnail navigation component for the slider.
 * A second Slider that synchronizes with the main slider.
 * User provides thumbnail slides as children.
 *
 * @param props.options - Options for the thumbnail slider.
 * @param props.plugins - Plugins for the thumbnail slider.
 *
 * @example
 * ```tsx
 * <SliderProvider>
 *   <Slider options={{ loop: true }}>
 *     <div class="keen-slider__slide">
 *       <img src="slide1.jpg" alt="Slide 1" />
 *     </div>
 *     <div class="keen-slider__slide">
 *       <img src="slide2.jpg" alt="Slide 2" />
 *     </div>
 *   </Slider>
 *   <SliderThumbnails options={{ slides: { perView: 4, spacing: 10 } }}>
 *     <div class="keen-slider__slide">
 *       <img src="thumb1.jpg" alt="Thumbnail 1" />
 *     </div>
 *     <div class="keen-slider__slide">
 *       <img src="thumb2.jpg" alt="Thumbnail 2" />
 *     </div>
 *   </SliderThumbnails>
 * </SliderProvider>
 * ```
 */
export const SliderThumbnails: FlowComponent<{
  options?: KeenSliderOptions;
  plugins?: KeenSliderPlugin[];
  activeClass?: string;
}> = (props) => {
  if (isServer) return <div>{props.children}</div>;

  const mainContext = useContext(SliderContext);

  if (!mainContext) {
    console.warn("SliderThumbnails must be used within a SliderProvider");
    return <div>{props.children}</div>;
  }

  const [mainHelpers] = mainContext;

  // Create thumbnail slider with user options
  const [thumbSlider, thumbHelpers] = createSlider(
    props.options || {},
    ...(props.plugins || []),
  );

  // Update on children change (same as main Slider)
  createEffect(
    () => access(props.children),
    () => queueMicrotask(() => thumbHelpers.update()),
    { defer: true },
  );

  // Sync thumbnail slider with main slider
  onSettled(() => {
    // Wait for next tick to ensure both sliders are mounted
    queueMicrotask(() => {
      const mainSliderInstance = mainHelpers()?.slider();
      const thumbSliderInstance = thumbHelpers.slider();

      if (mainSliderInstance && thumbSliderInstance) {
        // Function to update active thumbnail
        const activeClassName = props.activeClass || "active";
        const updateActiveThumbnail = () => {
          const mainCurrent = mainHelpers()?.current();
          if (mainCurrent !== undefined) {
            // Remove active class from all thumbnails
            thumbSliderInstance.slides.forEach((slide) => {
              slide.classList.remove(activeClassName);
            });
            // Add active class to current thumbnail
            if (thumbSliderInstance.slides[mainCurrent]) {
              thumbSliderInstance.slides[mainCurrent].classList.add(
                activeClassName,
              );
            }
            // Move thumbnail slider to show active thumbnail
            thumbHelpers.moveTo(mainCurrent);
          }
        };

        // Listen to main slider changes
        mainSliderInstance.on("slideChanged", updateActiveThumbnail);

        // Set initial active state
        updateActiveThumbnail();

        // Add click handlers to thumbnails
        thumbSliderInstance.slides.forEach((slide, idx) => {
          slide.addEventListener("click", () => {
            mainHelpers()?.moveTo(idx);
          });
        });
      }
    });
  });

  return <div ref={thumbSlider}>{props.children}</div>;
};
