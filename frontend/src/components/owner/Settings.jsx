import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Alert
} from '@mui/material';

const Settings = ({ settings, onUpdate }) => {
    const [businessSettings, setBusinessSettings] = useState(settings || {
        companyName: '',
        businessHours: {
            start: '08:00',
            end: '18:00'
        },
        notifications: {
            email: true,
            sms: true,
            lowStock: true,
            newOrders: true
        },
        deliverySettings: {
            maxRadius: 50,
            minOrderVolume: 100
        }
    });
    const [status, setStatus] = useState(null);

    const handleChange = (section, field, value) => {
        setBusinessSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onUpdate(businessSettings);
            setStatus({ type: 'success', message: 'Settings updated successfully' });
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                {/* Business Information */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Business Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    value={businessSettings.companyName}
                                    onChange={(e) => setBusinessSettings(prev => ({
                                        ...prev,
                                        companyName: e.target.value
                                    }))}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Opening Time"
                                    type="time"
                                    value={businessSettings.businessHours.start}
                                    onChange={(e) => handleChange('businessHours', 'start', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="Closing Time"
                                    type="time"
                                    value={businessSettings.businessHours.end}
                                    onChange={(e) => handleChange('businessHours', 'end', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Notification Settings */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Notifications
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={businessSettings.notifications.email}
                                        onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
                                    />
                                }
                                label="Email Notifications"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={businessSettings.notifications.sms}
                                        onChange={(e) => handleChange('notifications', 'sms', e.target.checked)}
                                    />
                                }
                                label="SMS Notifications"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={businessSettings.notifications.lowStock}
                                        onChange={(e) => handleChange('notifications', 'lowStock', e.target.checked)}
                                    />
                                }
                                label="Low Stock Alerts"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={businessSettings.notifications.newOrders}
                                        onChange={(e) => handleChange('notifications', 'newOrders', e.target.checked)}
                                    />
                                }
                                label="New Order Alerts"
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Delivery Settings */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Delivery Settings
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Maximum Delivery Radius (km)"
                                    type="number"
                                    value={businessSettings.deliverySettings.maxRadius}
                                    onChange={(e) => handleChange('deliverySettings', 'maxRadius', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Minimum Order Volume (L)"
                                    type="number"
                                    value={businessSettings.deliverySettings.minOrderVolume}
                                    onChange={(e) => handleChange('deliverySettings', 'minOrderVolume', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined">
                            Reset
                        </Button>
                        <Button type="submit" variant="contained">
                            Save Changes
                        </Button>
                    </Box>
                </Grid>

                {/* Status Message */}
                {status && (
                    <Grid item xs={12}>
                        <Alert severity={status.type}>
                            {status.message}
                        </Alert>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default Settings; 