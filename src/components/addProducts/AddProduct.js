// AddProduct.js
import React, { useState, useEffect } from 'react';
import Navbar from '../navbars/NavBars';
import { TextField, Button, Typography } from '@mui/material';
import './AddProduct.css';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { useNavigate } from 'react-router-dom';


const AddProduct = () => {
    const navigate = useNavigate();
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState({ label: '', value: '' });
    const [price, setPrice] = useState('');
    const [availableItems, setavailableItems] = useState('');
    const [manufacturer, setmanufacturer] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');
    const [categories, setCategories] = useState([]);

    
    console.log(token);
    // Check if token exists on component mount, if not, redirect to login
    useEffect(() => {
        if (token) {
            fetchCategories();
        } else {
            navigate('/login'); // Redirect to login if token is missing
        }
    }, [token, navigate]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://dev-project-ecommerce.upgrad.dev/api/products/categories', {
                headers: { "x-auth-token": token },
            });
            setCategories(response.data.map((cat) => ({ label: cat, value: cat })));
        } catch (error) {
            console.error("Error fetching categories:", error);
            setMessage('Error fetching categories. Please try again.');
        }
    };
	
	
    /*const handleCategoryChange = (newValue) => {
        if (newValue) { // Check if a value is selected (either from dropdown or newly created)
            setProductData({ ...productData, category: newValue.value }); 
        } else { // Handle the case where the user clears the selection
            setProductData({ ...productData, category: '' });
        }
    };*/

    const handleCategoryChange = (newValue) => {
        setCategory(newValue);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

									 
        const productData = {
            name: productName,
            category: category.value,  // Use the value from the CreatableSelect
            price: parseFloat(price),
            imageUrl: imageUrl,
            description: productDescription,
            manufacturer: manufacturer,
            availableItems: availableItems
        };

        console.log('Inside product form');
        // Check if token is present before making API call
        if (!token) {
            setMessage('User is not authenticated. Please log in again.');
            navigate('/login'); // Redirect to login if token is missing
            return;
        }

        // Make API call to add product with x-auth-token
        axios.post('https://dev-project-ecommerce.upgrad.dev/api/products', productData, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token // Use x-auth-token instead of Authorization
            },
        })
            .then((response) => {
                setMessage(`Product ${productName} added successfully`);
                setTimeout(() => {
                    navigate('/products'); // Redirect after success
                }, 1500);  // Redirect after 1.5 seconds
            })
            .catch((error) => {
                console.error("Error adding product:", error);
                if (error.response && error.response.status === 403) {
                    navigate('/addProduct')  // Redirect to login on unauthorized (403)
                }
                setMessage('Error adding product. Please try again.');
            });
    };


    return (
        <div className="add-product-page">
            <Navbar />
            <div className="add-product-container">
                <Typography variant="h4" gutterBottom>
                    Add Product
                </Typography>
                {message && <Typography variant="body1" className="success-message">{message}</Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />

                    <CreatableSelect
                        isClearable
                        onChange={handleCategoryChange}
                        value={category}
                        onCreateOption={(label) => {
                            setCategory({ label, value: label })
                        }} // Set category value to the new label
                        options={categories}  // No predefined options
                        placeholder="Category"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                margin: '10px 0', // Apply top margin to the control only
                            }),
                        }}

                    />

                    <TextField
                        label="Available Items"
                        variant="outlined"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={availableItems}
                        onChange={(e) => setavailableItems(e.target.value)}
                        required
                    />  

                    <TextField
                        label="Manufacturer"
                        variant="outlined"
                        multiline
                        rows={1}
                        fullWidth
                        margin="normal"
                        value={manufacturer}
                        onChange={(e) => setmanufacturer(e.target.value)}
                    />

                    <TextField
                        label="Price"
                        variant="outlined"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />

                    <TextField
                        label="Image URL"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />

                    <TextField
                        label="Product Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        SAVE PRODUCT
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
