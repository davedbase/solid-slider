import { createRouter } from "@solidjs/router";
import "./app.css";
import Home from "./routes/index";
import Autoplay from "./routes/autoplay";
import Dots from "./routes/dots";
import Primitive from "./routes/primitive";
import Thumbnails from "./routes/thumbnails";
import ThumbnailsSimple from "./routes/thumbnails-simple";

export const Router = createRouter({
  routes: [
    { path: "/", component: Home },
    { path: "/autoplay", component: Autoplay },
    { path: "/dots", component: Dots },
    { path: "/primitive", component: Primitive },
    { path: "/thumbnails", component: Thumbnails },
    { path: "/thumbnails-simple", component: ThumbnailsSimple },
  ],
});

export default function App() {
  return <Router>{(props) => props.children}</Router>;
}
