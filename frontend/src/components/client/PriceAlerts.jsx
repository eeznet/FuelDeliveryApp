import React, { useState } from 'react';
import {
    Paper,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Switch,
    Box,
    MenuItem
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const PriceAlerts = ({ alerts, onAddAlert, onDeleteAlert, onToggleAlert }) => {
    const [newAlert, setNewAlert] = useState({
        fuelType: '',
        targetPrice: ''
    });

    const fuelTypes = [
        { value: '93_octane', label: '93 Octane' },
        { value: '95_octane', label: '95 Octane' },
        { value: 'diesel', label: 'Diesel' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newAlert.fuelType && newAlert.targetPrice) {
            onAddAlert(newAlert);
            setNewAlert({ fuelType: '', targetPrice: '' });
        }
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Price Alerts
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Fuel Type"
                            value={newAlert.fuelType}
                            onChange={(e) => setNewAlert(prev => ({
                                ...prev,
                                fuelType: e.target.value
                            }))}
                        >
                            {fuelTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Target Price"
                            value={newAlert.targetPrice}
                            onChange={(e) => setNewAlert(prev => ({
                                ...prev,
                                targetPrice: e.target.value
                            }))}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={!newAlert.fuelType || !newAlert.targetPrice}
                        >
                            Add Alert
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <List>
                {alerts.map((alert) => (
                    <ListItem key={alert.id}>
                        <ListItemText
                            primary={`${fuelTypes.find(f => f.value === alert.fuelType)?.label} - $${alert.targetPrice}`}
                            secondary={`Alert when price drops below target`}
                        />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                checked={alert.active}
                                onChange={() => onToggleAlert(alert.id)}
                            />
                            <IconButton 
                                edge="end" 
                                onClick={() => onDeleteAlert(alert.id)}
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default PriceAlerts; 