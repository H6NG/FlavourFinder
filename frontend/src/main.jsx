import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import App from "./App.jsx"; 
import "./App.css";
import loginPage from "./Account/loginPage.jsx"; 
import signUpPage from "./Account/signUpPage.jsx";
import clientPage from "./mainPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<mainPage />} /> 
        <Route path="/signup" element={<signUpPage />} />
        <Route path="/login" element={<loginPage />} />
        <Route path="/app" element= {<App />} />
      </Routes>
    </Router>
  </StrictMode>
);