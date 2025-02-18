import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import {
    TrendingUp,
    AccountBalance,
    Payment,
    Receipt
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';

const FinancialOverview = ({ data }) => {
    const financialMetrics = [
        {
            title: 'Total Revenue',
            value: `$${data?.totalRevenue?.toLocaleString() || 0}`,
            change: '+15%',
            icon: <AccountBalance color="primary" />
        },
        {
            title: 'Monthly Profit',
            value: `$${data?.monthlyProfit?.toLocaleString() || 0}`,
            change: '+8%',
            icon: <TrendingUp color="success" />
        },
        {
            title: 'Pending Payments',
            value: `$${data?.pendingPayments?.toLocaleString() || 0}`,
            change: '-3%',
            icon: <Payment color="warning" />
        },
        {
            title: 'Operating Costs',
            value: `$${data?.operatingCosts?.toLocaleString() || 0}`,
            change: '+2%',
            icon: <Receipt color="error" />
        }
    ];

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue',
                data: data?.revenueHistory || [],
                borderColor: '#2196f3',
                fill: false
            },
            {
                label: 'Costs',
                data: data?.costHistory || [],
                borderColor: '#f44336',
                fill: false
            },
            {
                label: 'Profit',
                data: data?.profitHistory || [],
                borderColor: '#4caf50',
                fill: false
            }
        ]
    };

    return (
        <Box>
            <Grid container spacing={3}>
                {financialMetrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    {metric.icon}
                                    <Typography 
                                        variant="caption"
                                        color={metric.change.startsWith('+') ? 'success.main' : 'error.main'}
                                    >
                                        {metric.change}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" component="div">
                                    {metric.value}
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                    {metric.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Financial Performance
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Box sx={{ height: 400 }}>
                            <Line 
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FinancialOverview; 