import { useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // Import HashRouter and Switch
import Navbar from './components/Navbar';
import LoginForm from './components/Login';
import SignupForm from './components/SignupForm';
import HomeScreen from './components/HomeScreen';
import Profile from './components/Profile';



function App() {
  

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="signup" element={<SignupForm />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
