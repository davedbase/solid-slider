// @refresh reload
import { Suspense } from "solid-js";
import { Body, FileRoutes, Head, Html, Routes, Scripts, Title } from "solid-start";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart</Title>
      </Head>
      <Body>
        <Routes>
          <FileRoutes />
        </Routes>
        <Scripts />
      </Body>
    </Html>
  );
}
