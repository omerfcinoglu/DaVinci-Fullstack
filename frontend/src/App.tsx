import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";

function App() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
      {/* <Route element={<ProjectDetails />} path="/project" /> */}
      {/* <Route element={<Team />} path="/team" /> */}
    </Routes>
  );
}

export default App;
