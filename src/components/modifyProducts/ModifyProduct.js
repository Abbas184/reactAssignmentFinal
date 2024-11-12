// modifyProduct.js
import React, { useState, useEffect } from 'react';
import Navbar from '../navbars/NavBars';
import { TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import './ModifyProducts.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';


const ModifyProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState({ label: '', value: '' });
    const token = localStorage.getItem('token');
    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
											
        axios.get(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`, {
            headers: { 'x-auth-token': token }
        })
            .then(response => {
                setProduct(response.data);
                setCategory({ label: response.data.category, value: response.data.category }); // Set initial category
            })
            .catch(error => {
                console.error("Error fetching product:", error);
                setMessage('Error fetching product. Please try again.');
            });
    }, [id, token]);


      const handleCategoryChange = (newValue) => {
        if (newValue) { 
            setProduct({ ...product, category: newValue.value });
        } else { 
            setProduct({ ...product, category: '' });
        }
        setCategory(newValue); // Update the react-select value
    };

    const handleSubmit = (event) => {
        event.preventDefault();

																				  
        axios.put(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`, product, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
        })
            .then((response) => {
                setMessage(`Product ${product.name} updated successfully`);
                setTimeout(() => {
                    navigate('/products');
                }, 1500);
            })
            .catch((error) => {
                console.error("Error updating product:", error);
                setMessage('Error updating product. Please try again.');
            });
    };

    if (!product) {
        return <div>Loading...</div>;
    }


    return (
        <div className="modify-product-page">
            <Navbar />
            <div className="modify-product-container">
                <Typography variant="h4" gutterBottom>
                    Modify Product
                </Typography>
                {message && <Typography variant="body1" className="success-message">{message}</Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        required
                    />

                    <CreatableSelect  // Use CreatableSelect for categories
                        isClearable
                        onChange={handleCategoryChange}
                        value={category}
                        onCreateOption={(label) => {
                            setCategory({ label, value: label });
                            setProduct({ ...product, category: label }); // Also update product state
                        }}
                        options={categories} // Or add predefined categories if you have them
                        placeholder="Category"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                margin: '10px 0',
                            }),
                        }}
                    />

                    <TextField
                        label="Manufacturer"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={product.manufacturer}
                        onChange={(e) => setProduct({ ...product, manufacturer: e.target.value })}
                    />

                      <TextField
                        label="Available Items"
                        variant="outlined"
                        type="number" // Use type="number" for number inputs
                        fullWidth
                        margin="normal"
                        value={product.availableItems}
                        onChange={(e) => setProduct({ ...product, availableItems: parseInt(e.target.value, 10) || 0 })} // Parse as integer or default to 0
                        required
                    />


                    <TextField
                        label="Price"
                        variant="outlined"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })} //Parse as float, or default to 0
                        required
                    />


                    <TextField
                        label="Image URL"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={product.imageUrl}
                        onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
                    />

                    <TextField
                        label="Product Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        UPDATE PRODUCT
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ModifyProduct;