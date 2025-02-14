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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { owner } from '../services/api';

const OwnerDashboard = () => {
    const [stats, setStats] = useState({});
    const [priceForm, setPriceForm] = useState({
        pricePerLiter: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await owner.getStats();
            setStats(response.data);
        } catch (err) {
            setError('Failed to load business statistics');
        }
    };

    const handlePriceChange = (e) => {
        setPriceForm({
            ...priceForm,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdatePrice = async (e) => {
        e.preventDefault();
        try {
            await owner.updatePrice(parseFloat(priceForm.pricePerLiter));
            setSuccess('Price updated successfully');
            setPriceForm({ pricePerLiter: '' });
            loadData();
        } catch (err) {
            setError('Failed to update price');
        }
    };

    return (
        <Container>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Business Statistics</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4">${stats.totalRevenue || 0}</Typography>
                                    <Typography color="textSecondary">Total Revenue</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4">${stats.monthlyRevenue || 0}</Typography>
                                    <Typography color="textSecondary">Monthly Revenue</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4">{stats.totalDeliveries || 0}</Typography>
                                    <Typography color="textSecondary">Total Deliveries</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4">{stats.activeOrders || 0}</Typography>
                                    <Typography color="textSecondary">Active Orders</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Update Fuel Price</Typography>
                        <form onSubmit={handleUpdatePrice}>
                            <TextField
                                fullWidth
                                label="Price per Liter"
                                name="pricePerLiter"
                                type="number"
                                value={priceForm.pricePerLiter}
                                onChange={handlePriceChange}
                                margin="normal"
                                required
                                inputProps={{ step: "0.01", min: "0" }}
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                            >
                                Update Price
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OwnerDashboard; 