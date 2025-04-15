import { Routes, Route } from "react-router-dom";
import Section from "./components/Land";
import Home from "./components/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Section />} />
      <Route path="/index" element={<Home />} />
    </Routes>
  );
}

export default App;

