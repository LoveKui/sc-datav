import { lazy, Suspense } from "react";
import Loading from "./loading";

const Demo1 = lazy(() => import("./demo1"));

export default function Index() {
  return (
    <Suspense fallback={<Loading />}>
      <Demo1 />
    </Suspense>
  );
}
