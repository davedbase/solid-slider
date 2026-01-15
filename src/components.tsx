import {
  on,
  createContext,
  useContext,
  createSignal,
  FlowComponent,
  createEffect,
  For,
  Show,
  JSX,
  createMemo,
  Index,
  onMount,
} from "solid-js";
import { access } from "@solid-primitives/utils";
import { isServer } from "solid-js/web";
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
 * @param props {KeenSliderOptions} options - Accepts all KeenSlider options.
 * @param props {KeenSLiderPlugin} plugins - A list of Solid Slider or Keen slider plugins.
 */
export const SliderProvider: FlowComponent = (props) => (
  <SliderContext.Provider value={createSignal<SliderHelpers | null>(null)}>
    {props.children}
  </SliderContext.Provider>
);

/**
 * Main Slider component for specifying the Slider on the page.
 *
 * @param props {KeenSliderOptions} options - Accepts all KeenSlider options.
 * @param props {KeenSLiderPlugin} plugins - A list of Solid Slider or Keen slider plugins.
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
  setHelpers(helpers);
  createEffect(
    on(
      () => access(props.children),
      () => queueMicrotask(() => helpers.update()),
      { defer: true },
    ),
  );
  slider;
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
      class={props.class}
      classList={props.classList}
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
 * @param props {string} class - Class to override the dots container.
 * @param props {object} classList - List of classes to override the dots container.
 * @param props {string} dotClass - Class to override individual dots.
 * @param props {object} dotClassList - List of classes to override individual dots.
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
export const SliderDots: FlowComponent<{
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
  createEffect(() => {
    if (!context) return;
    const [helpers] = context;
    const sliderInstance = helpers()?.slider();

    if (sliderInstance) {
      const updateCount = () => {
        const details = helpers()?.details();
        setSlideCount(details?.slides?.length || 0);
      };

      // Set initial count
      updateCount();

      // Listen for slider changes
      sliderInstance.on("created", updateCount);
      sliderInstance.on("updated", updateCount);
    }
  });

  const slides = createMemo(() =>
    Array.from({ length: slideCount() }, (_, i) => i),
  );

  return (
    <Show when={context != null}>
      <div
        class={props.class || "keen-slider-dots"}
        classList={props.classList}
      >
        <Index each={slides()}>
          {(idx) => {
            const [helpers] = context!;
            const isActive = () => helpers()?.current() === idx();
            return (
              <button
                class={props.dotClass || "keen-slider-dot"}
                classList={{
                  ...props.dotClassList,
                  active: isActive(),
                }}
                onClick={() => handleDotClick(idx())}
                aria-label={`Go to slide ${idx() + 1}`}
              />
            );
          }}
        </Index>
      </div>
    </Show>
  );
};

/**
 * Thumbnail navigation component for the slider.
 * A second Slider that synchronizes with the main slider.
 * User provides thumbnail slides as children.
 *
 * @param props {KeenSliderOptions} options - Options for the thumbnail slider.
 * @param props {KeenSliderPlugin[]} plugins - Plugins for the thumbnail slider.
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
}> = (props) => {
  if (isServer) return <div class="keen-slider">{props.children}</div>;

  const mainContext = useContext(SliderContext);

  if (!mainContext) {
    console.warn("SliderThumbnails must be used within a SliderProvider");
    return <div class="keen-slider">{props.children}</div>;
  }

  const [mainHelpers] = mainContext;

  // Create thumbnail slider with user options
  const [thumbSlider, thumbHelpers] = createSlider(
    props.options || {},
    ...(props.plugins || []),
  );

  // Update on children change (same as main Slider)
  createEffect(
    on(
      () => access(props.children),
      () => queueMicrotask(() => thumbHelpers.update()),
      { defer: true },
    ),
  );

  // Sync thumbnail slider with main slider
  onMount(() => {
    // Wait for next tick to ensure both sliders are mounted
    queueMicrotask(() => {
      const mainSliderInstance = mainHelpers()?.slider();
      const thumbSliderInstance = thumbHelpers.slider();

      if (mainSliderInstance && thumbSliderInstance) {
        // Function to update active thumbnail
        const updateActiveThumbnail = () => {
          const mainCurrent = mainHelpers()?.current();
          if (mainCurrent !== undefined) {
            // Remove active class from all thumbnails
            thumbSliderInstance.slides.forEach((slide) => {
              slide.classList.remove("active");
            });
            // Add active class to current thumbnail
            if (thumbSliderInstance.slides[mainCurrent]) {
              thumbSliderInstance.slides[mainCurrent].classList.add("active");
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

  // Prevent tree-shaking
  thumbSlider;

  return (
    <div use:thumbSlider class="keen-slider">
      {props.children}
    </div>
  );
};
