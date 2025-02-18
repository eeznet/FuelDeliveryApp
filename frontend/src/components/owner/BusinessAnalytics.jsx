import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import { Bar } from 'react-chartjs-2';

const BusinessAnalytics = ({ data }) => {
    const salesData = {
        labels: ['93 Octane', '95 Octane', 'Diesel'],
        datasets: [{
            label: 'Sales by Fuel Type',
            data: data?.fuelSales || [],
            backgroundColor: [
                'rgba(33, 150, 243, 0.8)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(255, 152, 0, 0.8)'
            ]
        }]
    };

    const topClients = data?.topClients || [];
    const performanceMetrics = data?.performanceMetrics || {};

    return (
        <Grid container spacing={3}>
            {/* Sales by Fuel Type */}
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Sales Distribution by Fuel Type
                    </Typography>
                    <Box sx={{ height: 300 }}>
                        <Bar 
                            data={salesData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </Box>
                </Paper>
            </Grid>

            {/* Performance Metrics */}
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Key Performance Metrics
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Average Delivery Time
                            </Typography>
                            <Typography variant="h5">
                                {performanceMetrics.avgDeliveryTime || '0'} mins
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Customer Satisfaction
                            </Typography>
                            <Typography variant="h5">
                                {performanceMetrics.customerSatisfaction || '0'}%
                            </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Delivery Success Rate
                            </Typography>
                            <Typography variant="h5">
                                {performanceMetrics.successRate || '0'}%
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Top Clients Table */}
            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Top Performing Clients
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Client Name</TableCell>
                                <TableCell align="right">Total Orders</TableCell>
                                <TableCell align="right">Total Volume (L)</TableCell>
                                <TableCell align="right">Revenue</TableCell>
                                <TableCell align="right">Growth</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {topClients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell>{client.name}</TableCell>
                                    <TableCell align="right">{client.orders}</TableCell>
                                    <TableCell align="right">{client.volume}L</TableCell>
                                    <TableCell align="right">${client.revenue}</TableCell>
                                    <TableCell 
                                        align="right"
                                        sx={{ 
                                            color: client.growth >= 0 ? 'success.main' : 'error.main' 
                                        }}
                                    >
                                        {client.growth}%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default BusinessAnalytics; 