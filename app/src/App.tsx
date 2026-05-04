import "./styles.css";
import "./fonts.css";

import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/Tabs";
import { Dashboard } from "./components/Dashboard";
import { LogStats } from "./components/LogStats";
import { History } from "./components/History";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Create from "./pages/Create";
import Post from "./pages/Post";
import Edit from "./pages/Edit";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAchievementAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

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
