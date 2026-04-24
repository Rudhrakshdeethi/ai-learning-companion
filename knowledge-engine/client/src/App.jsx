import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import ChatPage from "./pages/ChatPage";
import GraphPage from "./pages/GraphPage";
import Workspace from "./pages/Workspace";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/workspace" element={<Workspace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
