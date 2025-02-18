import React, { useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Divider,
    Alert,
    Switch,
    FormControlLabel
} from '@mui/material';
import {
    Save as SaveIcon,
    Edit as EditIcon
} from '@mui/icons-material';

const ClientProfile = ({ profile, onUpdate }) => {
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(profile);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onUpdate(formData);
            setStatus({ type: 'success', message: 'Profile updated successfully' });
            setEditing(false);
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                {/* Company Information */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Company Information</Typography>
                            <Button
                                startIcon={editing ? <SaveIcon /> : <EditIcon />}
                                onClick={() => setEditing(!editing)}
                                variant={editing ? 'contained' : 'outlined'}
                            >
                                {editing ? 'Save Changes' : 'Edit Profile'}
                            </Button>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Company Name"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        companyName: e.target.value
                                    }))}
                                    disabled={!editing}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Business Registration Number"
                                    value={formData.registrationNumber}
                                    disabled={!editing}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tax ID"
                                    value={formData.taxId}
                                    disabled={!editing}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Contact Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Primary Contact"
                                    value={formData.primaryContact}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        primaryContact: e.target.value
                                    }))}
                                    disabled={!editing}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        email: e.target.value
                                    }))}
                                    disabled={!editing}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        phone: e.target.value
                                    }))}
                                    disabled={!editing}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Notification Preferences */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Notification Preferences
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.notifications?.email}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                notifications: {
                                                    ...prev.notifications,
                                                    email: e.target.checked
                                                }
                                            }))}
                                            disabled={!editing}
                                        />
                                    }
                                    label="Email Notifications"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.notifications?.sms}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                notifications: {
                                                    ...prev.notifications,
                                                    sms: e.target.checked
                                                }
                                            }))}
                                            disabled={!editing}
                                        />
                                    }
                                    label="SMS Notifications"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

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

export default ClientProfile; 