import { Component } from "solid-js";
// import { createSlider } from "solid-slider";
import { createSlider, Slider, SliderButton, SliderProvider } from "../../../src/index";
import autoplay from "../../../src/plugins/autoplay";

import "./index.css";
import "../../../src/slider.css";

// const App: Component = () => {
//   return (
//     <SliderProvider>
//       <Slider
//         options={{
//           loop: true,
//           initial: 3
//         }}
//         plugins={[autoplay(1500, {})]}
//       >
//         <div class="slide1">1</div>
//         <div class="slide2">2</div>
//         <div class="slide3">3</div>
//         <div class="slide4">4</div>
//         <div class="slide5">5</div>
//         <div class="slide6">6</div>
//       </Slider>
//       <SliderButton prev>Previous</SliderButton>
//       <SliderButton next>Next</SliderButton>
//     </SliderProvider>
//   );
// };

const App: Component = () => {
  const [slider, { current, next, prev, moveTo }] = createSlider({
    loop: true,
    initial: 4
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
        <select onChange={evt => moveTo(parseInt(evt.currentTarget.value) - 1)}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <button onClick={next}>Next</button>
      </div>
    </>
  );
};

export default App;
