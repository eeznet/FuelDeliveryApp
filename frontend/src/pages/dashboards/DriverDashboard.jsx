import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Container, CircularProgress, Alert } from '@mui/material';
import {
    DeliveryQueue,
    ActiveDelivery,
    DeliveryHistory,
    DriverStats
} from '../../components/driver';
import { RouteMap } from '../../components/maps';
import { useDriverDashboard } from '../../hooks/useDriverDashboard';

const DriverDashboard = () => {
    const { data, loading, error, updateDeliveryStatus } = useDriverDashboard();
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="xl">
            <Grid container spacing={3}>
                {/* Driver Stats */}
                <Grid item xs={12}>
                    <DriverStats stats={data?.stats} />
                </Grid>

                {/* Active Delivery and Map */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Current Delivery Route
                        </Typography>
                        <Box sx={{ height: 400 }}>
                            <RouteMap
                                origin={data?.activeDelivery?.origin}
                                destination={data?.activeDelivery?.destination}
                                waypoints={data?.activeDelivery?.waypoints}
                            />
                        </Box>
                    </Paper>
                    {data?.activeDelivery && (
                        <ActiveDelivery 
                            delivery={data.activeDelivery}
                            onStatusUpdate={updateDeliveryStatus}
                        />
                    )}
                </Grid>

                {/* Delivery Queue */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Upcoming Deliveries
                        </Typography>
                        <DeliveryQueue 
                            deliveries={data?.queue || []}
                            onDeliverySelect={setSelectedDelivery}
                        />
                    </Paper>
                </Grid>

                {/* Delivery History */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Deliveries
                        </Typography>
                        <DeliveryHistory 
                            deliveries={data?.history || []}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DriverDashboard; 