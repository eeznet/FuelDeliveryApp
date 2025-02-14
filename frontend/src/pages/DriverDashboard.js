import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip
} from '@mui/material';
import { orders } from '../services/api';

const DriverDashboard = () => {
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const [completedDeliveries, setCompletedDeliveries] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadDeliveries();
    }, []);

    const loadDeliveries = async () => {
        try {
            const response = await orders.getDriverDeliveries();
            const deliveries = response.data;
            setActiveDeliveries(deliveries.filter(d => d.status === 'pending'));
            setCompletedDeliveries(deliveries.filter(d => d.status === 'completed'));
        } catch (err) {
            setError('Failed to load deliveries');
        }
    };

    const handleUpdateStatus = async (deliveryId, status) => {
        try {
            await orders.updateDeliveryStatus(deliveryId, status);
            setSuccess(`Delivery ${status} successfully`);
            loadDeliveries();
        } catch (err) {
            setError('Failed to update delivery status');
        }
    };

    const DeliveryCard = ({ delivery, showActions }) => (
        <ListItem>
            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                            Delivery #{delivery.id}
                        </Typography>
                        <Chip 
                            label={delivery.status}
                            color={delivery.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                        />
                    </Box>
                }
                secondary={
                    <Box>
                        <Typography variant="body2">
                            Client: {delivery.client_name}
                        </Typography>
                        <Typography variant="body2">
                            Address: {delivery.address}
                        </Typography>
                        <Typography variant="body2">
                            Amount: {delivery.liters_delivered} liters
                        </Typography>
                        <Typography variant="body2">
                            Date: {new Date(delivery.created_at).toLocaleDateString()}
                        </Typography>
                        {showActions && (
                            <Box sx={{ mt: 1 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => handleUpdateStatus(delivery.id, 'completed')}
                                >
                                    Mark as Completed
                                </Button>
                            </Box>
                        )}
                    </Box>
                }
            />
        </ListItem>
    );

    return (
        <Container>
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
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Active Deliveries
                        </Typography>
                        <List>
                            {activeDeliveries.map((delivery) => (
                                <React.Fragment key={delivery.id}>
                                    <DeliveryCard delivery={delivery} showActions={true} />
                                    <Divider />
                                </React.Fragment>
                            ))}
                            {activeDeliveries.length === 0 && (
                                <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                                    No active deliveries
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Completed Deliveries
                        </Typography>
                        <List>
                            {completedDeliveries.map((delivery) => (
                                <React.Fragment key={delivery.id}>
                                    <DeliveryCard delivery={delivery} showActions={false} />
                                    <Divider />
                                </React.Fragment>
                            ))}
                            {completedDeliveries.length === 0 && (
                                <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                                    No completed deliveries
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DriverDashboard; 