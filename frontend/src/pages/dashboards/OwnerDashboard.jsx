import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Container, Grid, CircularProgress, Alert } from '@mui/material';
import { TabPanel, TabContext } from '@mui/lab';
import {
    FinancialOverview,
    BusinessAnalytics,
    StockStatus,
    DeliveryTable,
    MessageCenter,
    PricingEditor
} from '../../components/owner';
import { MapView } from '../../components/maps';
import { useOwnerDashboard } from '../../hooks/useOwnerDashboard';

const OwnerDashboard = () => {
    const { data, loading, error, refresh } = useOwnerDashboard();
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="xl">
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                            value={value} 
                            onChange={handleChange} 
                            aria-label="owner dashboard tabs"
                        >
                            <Tab label="Overview" value="1" />
                            <Tab label="Financial" value="2" />
                            <Tab label="Analytics" value="3" />
                            <Tab label="Operations" value="4" />
                            <Tab label="Messages" value="5" />
                        </Tabs>
                    </Box>

                    {/* Overview Tab */}
                    <TabPanel value="1">
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <StockStatus data={data.stock} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <PricingEditor />
                            </Grid>
                            <Grid item xs={12}>
                                <MapView deliveries={data.deliveries} />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Financial Tab */}
                    <TabPanel value="2">
                        <FinancialOverview data={data.financial} />
                    </TabPanel>

                    {/* Analytics Tab */}
                    <TabPanel value="3">
                        <BusinessAnalytics data={data.analytics} />
                    </TabPanel>

                    {/* Operations Tab */}
                    <TabPanel value="4">
                        <DeliveryTable deliveries={data.deliveries} />
                    </TabPanel>

                    {/* Messages Tab */}
                    <TabPanel value="5">
                        <MessageCenter messages={data.messages} />
                    </TabPanel>
                </TabContext>
            </Box>
        </Container>
    );
};

export default OwnerDashboard; 