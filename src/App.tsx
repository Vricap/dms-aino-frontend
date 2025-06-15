import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/header.tsx";
import { Sidebar } from "./components/sidebar.tsx";

import "./styles/globals.css";

// Import pages
import Dashboard from "./pages/Dashboard.tsx";
import Documents from "./pages/Documents.tsx";
import Signatures from "./pages/Signatures.tsx";
import Audit from "./pages/Audit.tsx";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="main-content flex">
          <Sidebar />
          <main className="content w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
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
