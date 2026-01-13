import { lazy } from "react";

const Demo0 = lazy(() => import("./demo0"));

export default function Index() {
  return <Demo0 />;
}
