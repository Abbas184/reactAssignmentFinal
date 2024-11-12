import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import Login from './components/logins/Logins';
import Signup from './components/signup/Signup';
import Product from './components/product/Product';
import AddProduct from './components/addProducts/AddProduct';
import ModifyProduct from './components/modifyProducts/ModifyProduct';
import ProductDetails from './components/productDetails/ProductDetails';
import ConfirmOrder from './components/confirmOrder/ConfirmOrder';
import SelectAddress from './components/selectAddress/SelectAddress';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Product/>}/>
          <Route path="/addProduct" element={<AddProduct/>}/>
          <Route path="/modifyProduct/:id" element={<ModifyProduct />} />
          <Route path="/productDetails/:id" element={<ProductDetails />} />
          <Route path="/productDetails/:id/selectAddress" element={<SelectAddress />} /> {/* New route */}
          <Route path="/productDetails/:id/confirmOrder" element={<ConfirmOrder />} /> {/* New route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
