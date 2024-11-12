import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, InputBase } from '@mui/material';
import { ShoppingCart, Search } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import './NavBars.css';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isProductPage = location.pathname === '/products';
  const isProductDetailsPage = location.pathname.startsWith('/productDetails');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <div className="navbar-container">
          <div className="logo-container">
            <ShoppingCart />
            <Typography variant="h6" className="logo-text">
              upGrad Eshop
            </Typography>
          </div>
          
								
          <div className="search-container">
            <div className="search-icon">
              <Search />
            </div>
            <InputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="nav-links">
            {!isLoggedIn ? (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                >
                  Login
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/signup"
                >
                  Sign Up
                </Button>
              </>
            ) : ( !isAdmin ? (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/products"
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => {
                    localStorage.removeItem('isLoggedIn');
                    window.location.href = '/login';
                  }}
                  className="logout-button" 
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/products"
                >
                  Home
                </Button>
                {isLoggedIn && isAdmin && !isProductDetailsPage && ( // Conditionally render Add Product button
        <Button
            color="inherit"
            component={Link}
            to="/addProduct"
        >
            Add Product
        </Button>
    )}
                <Button 
                  color="inherit" 
                  onClick={() => {
                    localStorage.removeItem('isLoggedIn');
                    window.location.href = '/login';
                  }}
                  className="logout-button" 
                >
                  Logout
                </Button>
              </>
            )
              
            )}
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;