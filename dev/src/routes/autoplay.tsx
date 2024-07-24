import { createSignal, For } from "solid-js";
import { Slider, SliderButton, SliderProvider } from "../../../src/index";
import { autoplay } from "../../../src/plugins/autoplay";

import "../../../src/slider.css";
import "./index.css";

export default function Home() {
  const [children, setChildren] = createSignal<number[]>([1, 2, 3]);
  return (
    <SliderProvider>
      <Slider
        options={{
          loop: true,
          initial: 3,
        }}
        plugins={[autoplay(1500, {})]}
      >
        <For each={children()}>
          {(item: number) => <div class={`slide${item}`}>{item}</div>}
        </For>
      </Slider>
      <button onClick={() => setChildren([1, 2, 3, 4, 5])}>Add Slides</button>
      <SliderButton prev>Previous</SliderButton>
      <SliderButton next>Next</SliderButton>
      <br />
      <br />
      <b>Slide Count:</b>
      {JSON.stringify(children())}
    </SliderProvider>
  );
}
