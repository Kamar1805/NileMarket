// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UploadItem from "./pages/UploadItem";
import Dashboard from './pages/Dashboard';
import ViewProduct from './components/ViewProduct';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<UploadItem />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/view/:id" element={<ViewProduct />} />
        <Route path='/AboutPage' element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
