import React from 'react';
import Navbar from '../navbars/NavBars';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <div className="welcome-container">
        <h1>Welcome to upGrad Eshop</h1>
        <p>Discover amazing products at great prices</p>
      </div>
    </div>
  );
}

export default LandingPage;
