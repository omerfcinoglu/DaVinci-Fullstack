import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import UsersPage from "./pages/Users/UsersPage";
import PostsPage from "./pages/Posts/PostsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="*" element={
        <div className="py-10">
          <p>Not found. <Link to="/" className="underline">Go Home</Link></p>
        </div>
      } />
    </Routes>
  );
}

export default App;
