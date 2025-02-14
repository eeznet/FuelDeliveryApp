import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import { orders } from '../services/api';

const ClientDashboard = () => {
    const [orderForm, setOrderForm] = useState({
        liters: '',
        address: ''
    });
    const [orderHistory, setOrderHistory] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await orders.getClientOrders();
            setOrderHistory(response.data);
        } catch (err) {
            setError('Failed to load orders');
        }
    };

    const handleChange = (e) => {
        setOrderForm({
            ...orderForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await orders.create(orderForm);
            setSuccess('Order placed successfully');
            setOrderForm({ liters: '', address: '' });
            loadOrders();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        }
    };

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Request Fuel Delivery
                        </Typography>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Liters Needed"
                                name="liters"
                                type="number"
                                value={orderForm.liters}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Delivery Address"
                                name="address"
                                value={orderForm.address}
                                onChange={handleChange}
                                margin="normal"
                                required
                                multiline
                                rows={3}
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                            >
                                Place Order
                            </Button>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order History
                        </Typography>
                        <List>
                            {orderHistory.map((order) => (
                                <React.Fragment key={order.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`Order #${order.id}`}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2">
                                                        Status: {order.status}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Amount: {order.liters_delivered} liters
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Total: ${order.total_price}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Date: {new Date(order.created_at).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ClientDashboard; 