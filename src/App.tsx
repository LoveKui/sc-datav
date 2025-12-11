import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import Loading from "./pages/Demo1/loading";

const SCDataV = lazy(() => import("./pages/SCDataV"));
const Demo1 = lazy(() => import("./pages/Demo1"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<SCDataV />} />
      <Route
        path="/demo1"
        element={
          <Suspense fallback={<Loading />}>
            <Demo1 />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
