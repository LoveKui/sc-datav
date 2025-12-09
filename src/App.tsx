import { lazy } from "react";
import { Route, Routes } from "react-router";

const SCDataV = lazy(() => import("./pages/SCDataV"));
const Demo1 = lazy(() => import("./pages/Demo1"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<SCDataV />} />
      <Route path="/demo1" element={<Demo1 />} />
    </Routes>
  );
}

export default App;
