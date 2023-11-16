import { Component, createSignal, For } from "solid-js";
// import { createSlider } from "solid-slider";
import { Slider, SliderButton, SliderProvider } from "../../../src/index";
import { autoplay } from "../../../src/plugins/autoplay";

import "./index.css";
import "../../../src/slider.css";

const App: Component = () => {
  const [childs, setChildren] = createSignal<number[]>([1, 2, 3]);
  return (
    <SliderProvider>
      <Slider
        options={{
          loop: true,
          initial: 3,
        }}
        plugins={[autoplay(1500, {})]}
      >
        <For each={childs()}>
          {(item: number) => <div class={`slide${item}`}>{item}</div>}
        </For>
      </Slider>
      <button onClick={() => setChildren([1, 2, 3, 4, 5])}>Add Slides</button>
      <SliderButton prev>Previous</SliderButton>
      <SliderButton next>Next</SliderButton>
      <br />
      <br />
      <b>Slide Count:</b>
      {JSON.stringify(childs())}
    </SliderProvider>
  );
};

// const App: Component = () => {
//   const [slider, { current, next, prev, moveTo }] = createSlider({
//     loop: true,
//     initial: 4
//   });
//   slider;
//   return (
//     <>
//       <div use:slider>
//         <div class="slide1">1</div>
//         <div class="slide2">2</div>
//         <div class="slide3">3</div>
//         <div class="slide4">4</div>
//         <div class="slide5">5</div>
//         <div class="slide6">6</div>
//       </div>
//       <br />
//       <div style={{ "text-align": "center" }}>
//         Current Slide: {current() + 1}
//         <br />
//         <button onClick={prev}>Prev</button>
//         <select onChange={evt => moveTo(parseInt(evt.currentTarget.value) - 1)}>
//           <option>1</option>
//           <option>2</option>
//           <option>3</option>
//         </select>
//         <button onClick={next}>Next</button>
//       </div>
//     </>
//   );
// };

export default App;
