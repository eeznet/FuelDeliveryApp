import React from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import {
    LocalShipping as DeliveryIcon,
    TrendingUp as TrendingIcon,
    AttachMoney as RevenueIcon,
    People as ClientIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';

const AdminStats = ({ stats }) => {
    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Orders',
                data: stats?.monthlyOrders || [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Revenue',
                data: stats?.monthlyRevenue || [],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Trends'
            }
        }
    };

    const statCards = [
        {
            title: 'Total Deliveries',
            value: stats?.totalDeliveries || 0,
            icon: <DeliveryIcon color="primary" />,
            trend: '+12%'
        },
        {
            title: 'Active Clients',
            value: stats?.activeClients || 0,
            icon: <ClientIcon color="success" />,
            trend: '+5%'
        },
        {
            title: 'Monthly Revenue',
            value: `$${stats?.monthlyRevenue?.slice(-1)[0] || 0}`,
            icon: <RevenueIcon color="warning" />,
            trend: '+8%'
        },
        {
            title: 'Growth Rate',
            value: `${stats?.growthRate || 0}%`,
            icon: <TrendingIcon color="info" />,
            trend: '+2%'
        }
    ];

    return (
        <Box>
            <Grid container spacing={3}>
                {statCards.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {stat.icon}
                                    <Typography 
                                        variant="caption" 
                                        color="success.main"
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <TrendingIcon fontSize="small" />
                                        {stat.trend}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ my: 1 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {stat.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {/* Monthly Trends Chart */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Line data={monthlyData} options={options} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminStats; 