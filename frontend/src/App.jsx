import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login.jsx";
import Signup from "./auth/Signup.jsx";
import Gallery from "./pages/Gallery.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Gallery />
            </RequireAuth>
          }
        />

        <Route
          path="/movies/:id"
          element={
            <RequireAuth>
              <MovieDetail />
            </RequireAuth>
          }
        />

        {/* Catch-all 404 or redirect to / */}
        <Route
          path="*"
          element={
            <RequireAuth>
              <Gallery />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}
