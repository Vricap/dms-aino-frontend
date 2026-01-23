import React from "react";
import {
  useLocation,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
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
import Send from "./pages/Send.jsx";
import Sent from "./pages/Sent.jsx";
import View from "./pages/View.jsx";
import Profile from "./pages/Profile.jsx";
import Users from "./pages/Users.jsx";
import Documents from "./pages/Documents.jsx";
import Signed from "./pages/Signed.jsx";
import EditUser from "./pages/EditUser.jsx";
import ProtectedRoute from "./components/protected-routes.jsx";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  return (
    <div className="app">
      {!isLoginPage && <Header />}
      <div className="main-content flex">
        {!isLoginPage && <Sidebar />}
        <main className="content w-full">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/draft"
              element={
                <ProtectedRoute>
                  <Draft />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/completed"
              element={
                <ProtectedRoute>
                  <Completed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signed"
              element={
                <ProtectedRoute>
                  <Signed />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/signatures" element={<Signatures />} /> */}
            {/* <Route path="/audit" element={<Audit />} /> */}
            <Route
              path="/send"
              element={
                <ProtectedRoute>
                  <Send />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sent"
              element={
                <ProtectedRoute>
                  <Sent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view"
              element={
                <ProtectedRoute>
                  <View />
                </ProtectedRoute>
              }
            />
            {localStorage.getItem("role") === "admin" && (
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
            )}
            {localStorage.getItem("role") === "admin" && (
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                }
              />
            )}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <EditUser />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
export default App;
