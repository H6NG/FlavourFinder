import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import App from "./App.jsx"; 
import "./App.css";
import LoginPage from "./Account/loginPage.jsx"; 
import SignUpPage from "./Account/signUpPage.jsx";
import ClientPage from "./mainPage.jsx";
import Test from "./Test.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<ClientPage />} /> 
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app" element= {<App />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  </StrictMode>
);