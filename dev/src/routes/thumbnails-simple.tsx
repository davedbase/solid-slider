import { Title } from "@solidjs/meta";
import { SliderProvider, Slider, SliderThumbnails } from "../../../src";
import "../../../src/slider.css";
import "./index.css";

export default function ThumbnailsSimpleExample() {
  return (
    <main>
      <Title>Slider with Thumbnail Navigation (Simple)</Title>
      <h1>Slider with Thumbnail Navigation (Simple)</h1>
      <div style={{ "max-width": "600px", margin: "0 auto" }}>
        <SliderProvider>
          <Slider options={{ loop: true }}>
            <div class="keen-slider__slide number-slide1">1</div>
            <div class="keen-slider__slide number-slide2">2</div>
            <div class="keen-slider__slide number-slide3">3</div>
            <div class="keen-slider__slide number-slide4">4</div>
          </Slider>
          <div style={{ "margin-top": "20px" }}>
            <SliderThumbnails options={{ slides: { perView: 4, spacing: 10 } }}>
              <div class="keen-slider__slide number-slide1" style={{ height: "60px" }}>Thumb 1</div>
              <div class="keen-slider__slide number-slide2" style={{ height: "60px" }}>Thumb 2</div>
              <div class="keen-slider__slide number-slide3" style={{ height: "60px" }}>Thumb 3</div>
              <div class="keen-slider__slide number-slide4" style={{ height: "60px" }}>Thumb 4</div>
            </SliderThumbnails>
          </div>
        </SliderProvider>
      </div>
    </main>
  );
}
