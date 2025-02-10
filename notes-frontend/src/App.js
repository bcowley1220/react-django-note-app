import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";
import "./styles.css";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access"));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("access"));
    };

    window.addEventListener("storage", checkAuth); // ✅ Listen for token changes

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/notes" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/notes" /> : <Register setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/notes"
          element={isAuthenticated ? (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Notes setIsAuthenticated={setIsAuthenticated} />
            </motion.div>
          ) : (
            <Navigate to="/login" />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
