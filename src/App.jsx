import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/header.jsx";
import { Sidebar } from "./components/sidebar.jsx";

import "./styles/globals.css";

// Import pages
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Upload from "./pages/Upload.jsx";
import Draft from "./pages/Draft.jsx";
import Inbox from "./pages/Inbox.jsx";
import Completed from "./pages/Completed.jsx";
// import Signatures from "./pages/Signatures.jsx";
// import Audit from "./pages/Audit.jsx";
import Sent from "./pages/Sent.jsx";
import View from "./pages/View.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="main-content flex">
          <Sidebar />
          <main className="content w-full">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/draft" element={<Draft />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/completed" element={<Completed />} />
              {/* <Route path="/signatures" element={<Signatures />} /> */}
              {/* <Route path="/audit" element={<Audit />} /> */}
              <Route path="/sent" element={<Sent />} />
              <Route path="/view" element={<View />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
export default App;
