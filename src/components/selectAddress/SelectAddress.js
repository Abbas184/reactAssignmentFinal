import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Container, Stepper, Step, StepLabel, Snackbar } from '@mui/material';
import axios from 'axios';
import Navbar from '../navbars/NavBars'; // Import your Navbar component
import { Alert, Position  } from '@mui/material'; 
import './SelectAddress.css'; 

const SelectAddress = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false); // State for alert
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState({
        name: '',
        contactNumber: '',
        street: '',
        city: '',
        state: '',
        landmark: '',
        zipcode: ''
    });
    const [activeStep, setActiveStep] = useState(1);
    const token = localStorage.getItem('token');
    const location = useLocation(); // Use useLocation hook
    const quantity = location.state?.quantity; 

    useEffect(() => {
        const fetchAddresses = () => {
            axios.get('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
                headers: { 'x-auth-token': token }
            })
                .then(response => setAddresses(response.data))
                .catch(error => console.error("Error fetching addresses:", error));
        };

        fetchAddresses();
    }, [token]);

    const handleAddressChange = (event) => {
        setSelectedAddress(event.target.value);
    };

    const handleNewAddressChange = (event) => {
        setNewAddress({ ...newAddress, [event.target.name]: event.target.value });
    };
    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return; // Don't close on clickaway
        }
        setShowAlert(false);
    };

    const handleSaveAddress = () => {
        axios.post('https://dev-project-ecommerce.upgrad.dev/api/addresses', newAddress, {
            headers: { 'x-auth-token': token }
        })
            .then(response => {
                // Add the newly created address to the addresses state
                setAddresses([...addresses, response.data]);
                setSelectedAddress(response.data.id); // Select the new address
                setNewAddress({
                    name: '', contactNumber: '', street: '', city: '', state: '', landmark: '', zipcode: ''
                });
            })
            .catch(error => console.error("Error adding address:", error));
    };

    const handleNext = () => {
        if (!selectedAddress) {
            setShowAlert(true);  // Open the success alert
                setTimeout(() => {         // Redirect after a short delay
            }, 3000); // 2 seconds
            return;
        }

        navigate(`/productDetails/${id}/confirmOrder`, { state: { selectedAddress, quantity } });
    };

    

    const handleBack = () => {
        navigate(`/productDetails/${id}`);
    };

    return (
        <div>
            <Navbar />
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Box sx={{ mt: 3, width: '100%' }}>
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

                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="address-select-label">Select Address</InputLabel>
                        <Select
                            labelId="address-select-label"
                            id="address-select"
                            value={selectedAddress}
                            label="Select Address"
                            onChange={handleAddressChange}
                        >
                            {addresses.map((address) => (
                                <MenuItem key={address.id} value={address.id}>
                                    {address.name} - {address.street}, {address.city}, {address.state}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>-OR-</Typography>

                    

                    <Box sx={{ mt: 2 }}>
                            <Typography variant="h6">Add Address</Typography>
                            <TextField label="Name *" fullWidth margin="normal" name="name" value={newAddress.name} onChange={handleNewAddressChange} required />
                            <TextField label="Contact Number *" fullWidth margin="normal" name="contactNumber" value={newAddress.contactNumber} onChange={handleNewAddressChange} required />
                            <TextField label="Street *" fullWidth margin="normal" name="street" value={newAddress.street} onChange={handleNewAddressChange} required />
                            <TextField label="City *" fullWidth margin="normal" name="city" value={newAddress.city} onChange={handleNewAddressChange} required />
                            <TextField label="State *" fullWidth margin="normal" name="state" value={newAddress.state} onChange={handleNewAddressChange} required />
                            <TextField label="Landmark" fullWidth margin="normal" name="landmark" value={newAddress.landmark} onChange={handleNewAddressChange} />
                            <TextField label="Zip Code *" fullWidth margin="normal" name="zipcode" value={newAddress.zipcode} onChange={handleNewAddressChange} required />
                            <Button variant="contained" color="primary" onClick={handleSaveAddress} sx={{ mt: 2 }}>Save Address</Button>
                        </Box>
                    

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={handleBack}>Back</Button>
                        <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
                    </Box>
                </Box>
                {showAlert && (
          <Snackbar
          open={showAlert}
          autoHideDuration={3000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position top-right
      >
          <Alert onClose={handleAlertClose} severity="error" className="error-alert" sx={{ width: '100%' }}>
              Please select an address!
          </Alert>
      </Snackbar>
        )}
            </Container>
        </div>
    );
};

export default SelectAddress;
