import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/header.jsx";
import { Sidebar } from "./components/sidebar.jsx";

import "./styles/globals.css";

// Import pages
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Documents from "./pages/Documents.jsx";
import Signatures from "./pages/Signatures.jsx";
import Audit from "./pages/Audit.jsx";

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
              <Route path="/documents" element={<Documents />} />
              <Route path="/signatures" element={<Signatures />} />
              <Route path="/audit" element={<Audit />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
export default App;
