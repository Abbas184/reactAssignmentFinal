import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../navbars/NavBars';
import { Typography, Button, Container, Box, Stepper, Step, StepLabel, Grid2, Alert, Snackbar, Position  } from '@mui/material';
import axios from 'axios';
import './ConfirmOrder.css'; 



const ConfirmOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [successAlertOpen, setSuccessAlertOpen] = useState(false); // For success alert
    const { selectedAddress, quantity } = location.state; // Get quantity from location state
    const [activeStep, setActiveStep] = useState(2);
    const token = localStorage.getItem('token');
    const [product, setProduct] = useState(null);
    const [addresses, setAddresses] = useState([]);
    // Retrieve product details (you'll need to fetch this based on the product ID)



    useEffect(() => {
        axios.get(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`, {
            headers: { 'x-auth-token': token }
        })
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error("Error fetching product details:", error);
            });

            const fetchAddresses = () => {
                axios.get('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
                    headers: { 'x-auth-token': token }
                })
                    .then(response => setAddresses(response.data))
                    .catch(error => console.error("Error fetching addresses:", error));
            };
    
            fetchAddresses();
    }, [id, token]);

    const handleConfirmOrder = async () => {
        try {
            const orderData = {
                quantity: quantity,
                product: id,
                address: selectedAddress
            };

            const response = await axios.post('https://dev-project-ecommerce.upgrad.dev/api/orders', orderData, {
                headers: { 'x-auth-token': token }
            });


            if (response.status === 201) {
                navigate('/products', { state: { orderSuccess: true } });

            } else {

                alert('Failed to place order. Please try again later.');

            }
        } catch (error) {
            console.error("Error confirming order:", error);

            alert('An error occurred while confirming the order.');
        }
    };
    
    const handleCloseSuccessAlert = () => {
        setSuccessAlertOpen(false);
    };

    const handleBack = () => {
        navigate(`/productDetails/${id}/selectAddress`);
    };


    if (!product) {
        return <div>Loading...</div>;
    }
    const selectedAddressObject = addresses.find(address => address.id === selectedAddress);
    return (
        <div>
            <Navbar />

            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={activeStep}>
                        <Step>
                            <StepLabel>Items</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Select Address</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Confirm Order</StepLabel>
                        </Step>
                    </Stepper>

                    <Grid2 container spacing={2}> {/* Added Grid for layout */}
                    <Grid2 item xs={12} md={6}> {/* Product details in left column */}
                        <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>Confirm Order</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}><b>Product:</b> {product.name}</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}><b>Quantity:</b> {quantity}</Typography>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: 'red' }}>
                            <b>Total Price: ₹{product.price * quantity}</b>
                        </Typography>
                    </Grid2>
                    <Grid2 item xs={12} md={6}> {/* Address details in right column */}
                        {selectedAddressObject && (
                            <>
                                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Address Details:</Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>{selectedAddressObject.name}</Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>Contact Number: {selectedAddressObject.contactNumber}</Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>{selectedAddressObject.street}</Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>{selectedAddressObject.city}</Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>{selectedAddressObject.state}</Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>{selectedAddressObject.zipcode}</Typography>
                                {selectedAddressObject.landmark && (
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>Landmark: {selectedAddressObject.landmark}</Typography>
                                )}
                            </>
                        )}
                    </Grid2>
                </Grid2>
                                       
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={handleBack}>Back</Button>
                        <Button variant="contained" color="primary" onClick={handleConfirmOrder}>Place Order</Button>
                    </Box>
                </Box>


            </Container>
        </div>
    );
};

export default ConfirmOrder;