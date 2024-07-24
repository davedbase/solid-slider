import { createSlider } from "../../../src/primitive";

import "./index.css";
import "../../../src/slider.css";

export default function Home() {
  const [slider, { current, next, prev, moveTo }] = createSlider({
    loop: true,
    initial: 4,
  });
  slider;
  return (
    <>
      <div use:slider>
        <div class="slide1">1</div>
        <div class="slide2">2</div>
        <div class="slide3">3</div>
        <div class="slide4">4</div>
        <div class="slide5">5</div>
        <div class="slide6">6</div>
      </div>
      <br />
      <div style={{ "text-align": "center" }}>
        Current Slide: {current() + 1}
        <br />
        <button onClick={prev}>Prev</button>
        <select
          onChange={(evt) => moveTo(parseInt(evt.currentTarget.value) - 1)}
        >
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <button onClick={next}>Next</button>
      </div>
    </>
  );
}
