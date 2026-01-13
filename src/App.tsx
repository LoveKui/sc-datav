import { Route, Routes } from "react-router";
import Portal from "@/pages/Portal";
import Demo1 from "@/pages/Demo1";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portal />} />
      <Route path="/demo1" element={<Demo1 />} />
    </Routes>
  );
}

export default App;
