// Login.js
import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Link, Grid2, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbars/NavBars'; // Adjust path if necessary
import './Logins.css';


const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Set the primary color to the desired navbar color
    },
  },
});

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  localStorage.setItem('isLoggedIn', 'false');
  const handleSubmit = async (event) => {
    event.preventDefault();
  const isAdmin = false;
    try {
      const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/auth/signin', {  // Your backend API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username:email, password })
      });

      if (response.ok) {
        console.log('Login successful');
        const data = await response.json();
        const token = response.headers['x-auth-token']; // Correctly extract the token
        // Earlier as instructed we were hardcoding the x-auth-token manually 
        //const token = '';
        const roles = data.roles;
        const isAdmin = roles.includes('ADMIN');
        localStorage.setItem('token', token);

        //Previous way of checking if logged in user is admin
        /*const userResponse = await fetch('http://localhost:8080/api/users', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`, // Include token to authenticate
            },
          });*/
        //Updated API call sends response with role so changing the admin value


        localStorage.setItem('isAdmin', isAdmin);
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/products')



    }



      else {
															 
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        alert("Login Failed. Check credentials.");
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      alert("An error occurred during login.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box className="login-container">
			   
						 
							
									
								 
			
		 
          <Avatar className="avatar-container" sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate className="form-container" sx={{ mt: 3 }}>
            <TextField
              className="form-field"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              className="form-field"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />


            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="submit-button"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid2 container className="signup-link">
			  
              <Grid2 item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
        <Copyright className="copyright" sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}



function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.upgrad.com/">
        upGrad
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}