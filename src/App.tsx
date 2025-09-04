import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimpleTest from "./pages/SimpleTest";
import ComicHomepage from "./pages/ComicHomepage";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ComicHomepage />} />
      <Route path="/test" element={<SimpleTest />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
