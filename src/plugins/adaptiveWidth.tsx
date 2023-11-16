import { KeenSliderInstance } from "keen-slider";

/**
 * Adaptive width is a plugin that adjusts the width of the slider to the content on change.
 *
 * @example
 * ```ts
 * const [create] = createSlider({}, [adaptiveWidth]);
 * ```
 */
export const adaptiveWidth = () => {
  return (slider: KeenSliderInstance) => {
    function updateWidth() {
      slider.container.style.width =
        slider.slides[slider.track.details.rel].offsetWidth + "px";
    }
    slider.on("created", updateWidth);
    slider.on("slideChanged", updateWidth);
  };
};
