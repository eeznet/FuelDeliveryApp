import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Container, CircularProgress, Alert, Tab, Tabs } from '@mui/material';
import {
    OrderHistory,
    NewOrder,
    BillingInfo,
    ClientMessages,
    ClientProfile
} from '../../components/client';
import { useClientDashboard } from '../../hooks/useClientDashboard';

const ClientDashboard = () => {
    const { data, loading, error, createOrder } = useClientDashboard();
    const [activeTab, setActiveTab] = useState('orders');

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="xl">
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{ mb: 3 }}
                >
                    <Tab label="Orders" value="orders" />
                    <Tab label="Messages" value="messages" />
                    <Tab label="Billing" value="billing" />
                    <Tab label="Profile" value="profile" />
                </Tabs>

                {activeTab === 'orders' && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    New Order
                                </Typography>
                                <NewOrder onSubmit={createOrder} />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Order History
                                </Typography>
                                <OrderHistory orders={data?.orders || []} />
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {activeTab === 'messages' && (
                    <Paper sx={{ p: 2 }}>
                        <ClientMessages messages={data?.messages || []} />
                    </Paper>
                )}

                {activeTab === 'billing' && (
                    <Paper sx={{ p: 2 }}>
                        <BillingInfo billingData={data?.billing || {}} />
                    </Paper>
                )}

                {activeTab === 'profile' && (
                    <Paper sx={{ p: 2 }}>
                        <ClientProfile profile={data?.profile || {}} />
                    </Paper>
                )}
            </Box>
        </Container>
    );
};

export default ClientDashboard; 