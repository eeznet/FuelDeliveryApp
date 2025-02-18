import React from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    LinearProgress
} from '@mui/material';
import {
    LocalShipping,
    Speed,
    Star,
    Timeline
} from '@mui/icons-material';

const DriverStats = ({ stats }) => {
    const statItems = [
        {
            icon: <LocalShipping color="primary" />,
            title: 'Deliveries Today',
            value: stats?.deliveriesToday || 0,
            total: stats?.totalDeliveriesToday || 0,
            color: 'primary.main'
        },
        {
            icon: <Speed color="success" />,
            title: 'Average Time',
            value: `${stats?.averageDeliveryTime || 0}min`,
            progress: (stats?.averageDeliveryTime || 0) / 120 * 100,
            color: 'success.main'
        },
        {
            icon: <Star color="warning" />,
            title: 'Rating',
            value: stats?.rating || 0,
            progress: (stats?.rating || 0) * 20,
            color: 'warning.main'
        },
        {
            icon: <Timeline color="info" />,
            title: 'Efficiency',
            value: `${stats?.efficiency || 0}%`,
            progress: stats?.efficiency || 0,
            color: 'info.main'
        }
    ];

    return (
        <Grid container spacing={3}>
            {statItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            {item.icon}
                            <Typography 
                                variant="h6" 
                                component="div" 
                                sx={{ ml: 1 }}
                            >
                                {item.value}
                            </Typography>
                        </Box>
                        <Typography 
                            color="text.secondary" 
                            variant="body2" 
                            gutterBottom
                        >
                            {item.title}
                        </Typography>
                        {item.progress !== undefined && (
                            <LinearProgress
                                variant="determinate"
                                value={item.progress}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: item.color
                                    }
                                }}
                            />
                        )}
                        {item.total && (
                            <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ mt: 1, display: 'block' }}
                            >
                                {item.value} of {item.total} completed
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default DriverStats; 