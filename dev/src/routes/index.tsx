import { createSignal, For } from "solid-js";
import { Slider, SliderButton, SliderProvider } from "../../../src/index";

import "../../../src/slider.css";
import "./index.css";

export default function Home() {
  const [children, setChildren] = createSignal<number[]>([1, 2, 3]);
  return (
    <div>
      <h1>Solid Slider Examples</h1>
      <nav style={{ "margin-bottom": "20px" }}>
        <a href="/">Basic</a> | <a href="/dots">Dots Navigation</a> |{" "}
        <a href="/thumbnails">Thumbnail Navigation</a> |{" "}
        <a href="/thumbnails-simple">Thumbnails (simple)</a> |{" "}
        <a href="/autoplay">Autoplay</a> | <a href="/primitive">Primitive</a>
      </nav>
      <SliderProvider>
        <Slider
          options={{
            loop: true,
            initial: 3,
          }}
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
    </div>
  );
}
