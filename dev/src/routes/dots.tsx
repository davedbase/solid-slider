import { Title } from "@solidjs/meta";
import { SliderProvider, Slider, SliderDots } from "../../../src";

import "../../../src/slider.css";
import "./index.css";

export default function DotsExample() {
  return (
    <main>
      <Title>Slider with Dots Navigation</Title>
      <h1>Slider with Dots Navigation</h1>
      <div style={{ "max-width": "600px", margin: "0 auto" }}>
        <SliderProvider>
          <Slider options={{ loop: true }}>
            <div class="slide1">1</div>
            <div class="slide2">2</div>
            <div class="slide3">3</div>
            <div class="slide4">4</div>
            <div class="slide5">5</div>
            <div class="slide6">6</div>
          </Slider>
          <SliderDots />
        </SliderProvider>
      </div>
    </main>
  );
}
