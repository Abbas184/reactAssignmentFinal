// productDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../navbars/NavBars';
import axios from 'axios';
import { Typography, TextField, Button, Box, Chip, Container } from '@mui/material'; // Import Container
import './ProductDetails.css'; // Import the CSS file
import Stack from '@mui/material/Stack';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const token = localStorage.getItem('token');
    const [activeStep, setActiveStep] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState({
        name: '', contactNumber: '', street: '', city: '', state: '', landmark: '', zipcode: ''
    });
    const [addressError, setAddressError] = useState(false);

    const fetchAddresses = () => {
        axios.get('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
            headers: { 'x-auth-token': token }
        })
            .then(response => setAddresses(response.data))
            .catch(error => console.error("Error fetching addresses:", error));
    };

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            navigate('/login');
        }

        axios.get(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`, {
            headers: { 'x-auth-token': token }
        })
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error("Error fetching product details:", error);
                // Handle the error, e.g., display an error message
            });

         // Fetch categories (separate API call)
    axios.get('https://dev-project-ecommerce.upgrad.dev/api/products/categories', {
        headers: { "x-auth-token": token }
    })
        .then(response => {
            setCategories(response.data); // Update the categories state
        })
        .catch(error => console.log(error)); // Handle error appropriately
    
            // Fetch addresses when component mounts
    fetchAddresses();

    }, [id, navigate, token]);

    const handleNext = () => {
        if (activeStep === 0) {
            navigate(`/productDetails/${id}/selectAddress`); // Redirect to /selectAddress route
        } else if (activeStep === 1) {
            if (!selectedAddress) {
                setAddressError(true);
                return; // Prevent moving to next step if no address is selected
            }
            navigate(`/productDetails/${id}/confirmOrder`); // Redirect to /confirmOrder route

        }
         else {
            handlePlaceOrder();
        }
    };
  

    const handleQuantityChange = (event) => {
        setQuantity(parseInt(event.target.value, 10) || 1); // Ensure quantity is an integer
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    const handlePlaceOrder = () => {
        navigate(`/productDetails/${id}/selectAddress`, { state: { quantity } }); // Pass quantity in state
    };
    if (!product) {
        return <div>Loading product details...</div>; // Or a more styled loading indicator
    }

    return (
        <div>
        <Navbar />
        <Container maxWidth="lg"> {/* Changed to lg for more width */}
            <div className="product-details-container">
                <div className="product-details-content">
                    <div className="product-image-container">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="product-image"
                            onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                        />
                    </div>

                    <Box className="product-info">
                        <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                            <Typography variant="h4" component="h1" fontWeight="bold">
                                {product.name}
                            </Typography>
                            <Chip
                                label={`Available: ${product.availableItems}`}
                                size="small"
                                sx={{ backgroundColor: 'primary.main', color: 'white' }}
                            />
                        </Stack>
                        <Typography variant="h6" color="text.secondary" fontWeight="bold" sx={{ mt: 2 }}>
                            Category: {product.category}
                        </Typography>
                        
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {product.description}
                        </Typography>
                        <Typography variant="h5" color="error" sx={{ mt: 3 }}>
                            ₹ {product.price}
                        </Typography>

                        <Box sx={{ mt: 3 }}>
                            <TextField
                                type="number"
                                label="Enter Quantity"
                                value={quantity}
                                onChange={handleQuantityChange}
                                InputProps={{ inputProps: { min: 1 } }}
                                size="small"
                                required
                            />
                        </Box>
                        
                        <Button
        variant="contained"
        color="primary"
        onClick={handlePlaceOrder}
        sx={{ mt: 3 }}
        fullWidth
    >
        PLACE ORDER
    </Button>
                    </Box>
                </div>
            </div>
        </Container>
    </div>
    );
};

export default ProductDetails;