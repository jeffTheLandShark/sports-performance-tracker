import "./styles.css";
import "./fonts.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Create from "./pages/Create";
import Post from "./pages/Post";
import Edit from "./pages/Edit";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/create" element={<Create />} />
            <Route path="/performance/:id" element={<Post />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
