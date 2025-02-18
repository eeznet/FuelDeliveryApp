import React, { useState, useEffect } from 'react';
import { Grid, Card, Typography, Box } from '@mui/material';
import { MapView } from '../../components/maps';
import {
    DeliveryManagement,
    DriverManagement,
    StockMonitoring,
    OrderQueue
} from '../../components/admin';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        deliveries: [],
        drivers: [],
        stock: {},
        orders: []
    });

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Live Tracking */}
                <Grid item xs={12}>
                    <Card sx={{ p: 2, height: '400px' }}>
                        <Typography variant="h6">Live Fleet Tracking</Typography>
                        <MapView deliveries={dashboardData.deliveries} />
                    </Card>
                </Grid>

                {/* Driver Management */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6">Driver Management</Typography>
                        <DriverManagement drivers={dashboardData.drivers} />
                    </Card>
                </Grid>

                {/* Stock Monitoring */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6">Stock Levels</Typography>
                        <StockMonitoring stock={dashboardData.stock} />
                    </Card>
                </Grid>

                {/* Delivery Management */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6">Active Deliveries</Typography>
                        <DeliveryManagement deliveries={dashboardData.deliveries} />
                    </Card>
                </Grid>

                {/* Order Queue */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6">Pending Orders</Typography>
                        <OrderQueue orders={dashboardData.orders} />
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard; 