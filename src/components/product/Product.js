// Product.js
import React, { useEffect, useState } from 'react';
import Navbar from '../navbars/NavBars';
import { Card, CardContent, CardMedia, Typography, Button, Select, MenuItem, IconButton, Dialog, DialogTitle, DialogActions, Grid2 } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import './Product.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
			

const Product = () => {
				   
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('');
    const [message, setMessage] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            navigate('/login');
        }
        if (location.state?.orderSuccess) {
            setShowSuccessMessage(true);
            // Clear location state to prevent message showing again after refresh
            navigate(location.pathname, { replace: true, state: {} }); 
        }
    }, [location.state, navigate]);

    const handleSnackbarClose = () => {
        setShowSuccessMessage(false);
    };					 
    useEffect(() => {
        axios.get('https://dev-project-ecommerce.upgrad.dev/api/products/categories', {
            headers: { "x-auth-token": token }
        })
            .then(response => {
                setCategories(['all', ...response.data]);
            })
            .catch(error => console.log(error));
    }, [token]);


					  
    useEffect(() => {
        axios.get('https://dev-project-ecommerce.upgrad.dev/api/products', {
	  
            headers: { "x-auth-token": token }
	
        })
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => console.log(error));
    }, [token]);

					
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        let sortedProducts = [...products];
        
        switch (event.target.value) {
            case 'price-high-low':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'price-low-high':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'newest':
                sortedProducts.sort((a, b) => a.id - b.id);
                break;
            default:
                break;
        }
        setProducts(sortedProducts);
    };

    const handleDeleteClick = (productId) => {
        setProductToDelete(productId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (productToDelete) {
            axios.delete(`https://dev-project-ecommerce.upgrad.dev/api/products/${productToDelete}`, {
                headers: { 'x-auth-token': token }
            })
                .then(() => {
														
                    setProducts(products.filter(product => product.id !== productToDelete));
                    setMessage('Product Shoes deleted successfully');
                    setTimeout(() => setMessage(''), 3000);

                })
                .catch(error => {
                    console.error("Error deleting product:", error);
                    setMessage('Error deleting product');
                    setTimeout(() => setMessage(''), 3000);
                });
        }
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };


    return (
        <div className="products-page">
            <Navbar />
            {message && (
                <div className="message-banner" style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    backgroundColor: message.includes('successfully') ? '#4CAF50' : '#f44336',
                    color: 'white',
                    padding: '12px 24px',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Typography>{message}</Typography>
                    <IconButton size="small" style={{ color: 'white' }} onClick={() => setMessage('')}>
                        <CloseIcon />
                    </IconButton>
                </div>
            )}

            <div className="category-tabs">
                <ToggleButtonGroup
                    value={selectedCategory}
                    exclusive
                    onChange={(event, newCategory) => setSelectedCategory(newCategory || 'all')}
                    aria-label="product categories"
                >
						
                    {categories.map((category) => (
                        <ToggleButton key={category} value={category} aria-label={category}>
                            {category}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </div>

            <Select value={sortOrder} onChange={handleSortChange} displayEmpty>
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="price-high-low">Price high to low</MenuItem>
                <MenuItem value="price-low-high">Price low to high</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
            </Select>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm deletion of product!
                </DialogTitle>
                <Typography sx={{ px: 3, pb: 2 }}>
                    Are you sure you want to delete the product?
                </Typography>
                <DialogActions>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="primary">
                        OK
                    </Button>
                    <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
                        CANCEL
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="products-container">
                {products
                    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
                    .map((product) => (
                        <Card key={product.id} className="product-card">

						
<div className="product-image-container">
    <CardMedia
        component="img"
        className="product-image"
        image={product.imageUrl}
        alt={product.name}
    />
</div>

                            <CardContent className="card-content">
                                <Grid2 container alignItems="center" justifyContent="space-between"> {/* Use Grid for layout */}
                                    <Grid2 item>
                                        <Typography variant="h6" component="div"> {/* Smaller title */}
                                            {product.name}
                                        </Typography>
                                    </Grid2>
                                    <Grid2 item textAlign="right"> {/* Price on the right */}
                                        <Typography variant="h6" color="text.secondary">
                                            ₹{product.price}
                                        </Typography>
                                    </Grid2>
                                </Grid2>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                            </CardContent>
							
                            <Snackbar
                open={showSuccessMessage}  // Use showSuccessMessage here
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" className="success-alert" sx={{ width: '100%' }}>
                    Order placed successfully!
                </Alert>
            </Snackbar>
                            <div className="card-actions">
    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%"> {/* Use Box */}
        <Button variant="contained" color="primary" onClick={() => navigate(`/productDetails/${product.id}`)}>Buy</Button>
        {isAdmin && (
            <Box> {/* Wrap icons in a Box for better alignment */}
                <IconButton
                    aria-label="edit"
                    onClick={() => navigate(`/modifyProduct/${product.id}`)}
                >
                    <EditIcon />
                </IconButton>

                <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteClick(product.id)}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>
        )}
    </Box>
</div>
                        </Card>
                    ))}
            </div>
        </div>
    );
};

export default Product;