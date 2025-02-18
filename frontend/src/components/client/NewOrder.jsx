import React, { useState } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Alert,
    Grid,
    Typography
} from '@mui/material';
import { LocalGasStation as FuelIcon } from '@mui/icons-material';

const NewOrder = ({ onSubmit }) => {
    const [orderData, setOrderData] = useState({
        fuelType: '',
        volume: '',
        deliveryAddress: '',
        preferredDate: '',
        notes: ''
    });
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(orderData);
            setStatus({ type: 'success', message: 'Order placed successfully' });
            setOrderData({
                fuelType: '',
                volume: '',
                deliveryAddress: '',
                preferredDate: '',
                notes: ''
            });
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    const fuelTypes = [
        { value: '93_octane', label: '93 Octane', price: 3.50 },
        { value: '95_octane', label: '95 Octane', price: 3.75 },
        { value: 'diesel', label: 'Diesel', price: 3.25 }
    ];

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        select
                        fullWidth
                        label="Fuel Type"
                        value={orderData.fuelType}
                        onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            fuelType: e.target.value
                        }))}
                        required
                    >
                        {fuelTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <FuelIcon sx={{ mr: 1 }} />
                                    <Typography>{option.label}</Typography>
                                    <Typography color="text.secondary">
                                        ${option.price}/L
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Volume (Liters)"
                        value={orderData.volume}
                        onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            volume: e.target.value
                        }))}
                        required
                        inputProps={{ min: 100 }}
                        helperText="Minimum order: 100L"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Delivery Address"
                        value={orderData.deliveryAddress}
                        onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            deliveryAddress: e.target.value
                        }))}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        type="datetime-local"
                        label="Preferred Delivery Date"
                        value={orderData.preferredDate}
                        onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            preferredDate: e.target.value
                        }))}
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Additional Notes"
                        value={orderData.notes}
                        onChange={(e) => setOrderData(prev => ({
                            ...prev,
                            notes: e.target.value
                        }))}
                    />
                </Grid>

                {status && (
                    <Grid item xs={12}>
                        <Alert severity={status.type}>
                            {status.message}
                        </Alert>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                    >
                        Place Order
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NewOrder; 