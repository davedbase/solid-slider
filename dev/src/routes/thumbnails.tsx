import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import { SliderProvider, Slider, SliderThumbnails } from "../../../src";
import "../../../src/slider.css";
import "./index.css";

export default function ThumbnailsExample() {
  const images = [
    {
      full: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      thumb:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150",
    },
    {
      full: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
      thumb:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=150",
    },
    {
      full: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800",
      thumb:
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=150",
    },
    {
      full: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
      thumb:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=150",
    },
    {
      full: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800",
      thumb:
        "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=150",
    },
  ];

  return (
    <main>
      <Title>Slider with Thumbnail Navigation</Title>
      <h1>Slider with Thumbnail Navigation</h1>
      <div style={{ "max-width": "800px", margin: "0 auto" }}>
        <SliderProvider>
          <Slider options={{ loop: true }}>
            <For each={images}>
              {(img) => (
                <div class="keen-slider__slide">
                  <img
                    src={img.full}
                    alt="Slide"
                    style={{
                      width: "100%",
                      height: "400px",
                      "object-fit": "cover",
                    }}
                  />
                </div>
              )}
            </For>
          </Slider>
          <div style={{ "margin-top": "20px" }}>
            <SliderThumbnails options={{ slides: { perView: 5, spacing: 10 } }}>
              <For each={images}>
                {(img) => (
                  <div class="keen-slider__slide thumbnail-slide">
                    <img
                      src={img.thumb}
                      alt="Thumbnail"
                      style={{
                        width: "100%",
                        height: "80px",
                        "object-fit": "cover",
                      }}
                    />
                  </div>
                )}
              </For>
            </SliderThumbnails>
          </div>
        </SliderProvider>
      </div>
      <style>{`
        .thumbnail-slide {
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .thumbnail-slide:hover {
          opacity: 0.8;
        }
        .keen-slider__slide.thumbnail-slide.active {
          opacity: 1;
        }
      `}</style>
    </main>
  );
}
