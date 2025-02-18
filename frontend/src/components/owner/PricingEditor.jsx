import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Grid,
    Typography,
    Alert 
} from '@mui/material';

const PricingEditor = () => {
    const [prices, setPrices] = useState({
        octane93: '',
        octane95: '',
        diesel: ''
    });
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // API call to update prices
            setStatus({ type: 'success', message: 'Prices updated successfully' });
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {Object.keys(prices).map((fuel) => (
                    <Grid item xs={12} sm={4} key={fuel}>
                        <TextField
                            fullWidth
                            label={fuel.replace(/([A-Z])/g, ' $1').toUpperCase()}
                            value={prices[fuel]}
                            onChange={(e) => setPrices(prev => ({
                                ...prev,
                                [fuel]: e.target.value
                            }))}
                            type="number"
                            step="0.01"
                            required
                        />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        fullWidth
                    >
                        Update Prices
                    </Button>
                </Grid>
            </Grid>
            {status && (
                <Alert 
                    severity={status.type} 
                    sx={{ mt: 2 }}
                >
                    {status.message}
                </Alert>
            )}
        </Box>
    );
};

export default PricingEditor; 