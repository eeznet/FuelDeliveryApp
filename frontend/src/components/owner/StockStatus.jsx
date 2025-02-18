import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const StockStatus = ({ data }) => {
    const fuelTypes = [
        { name: '93 Octane', level: data?.octane93 || 0, color: '#2196f3' },
        { name: '95 Octane', level: data?.octane95 || 0, color: '#4caf50' },
        { name: 'Diesel', level: data?.diesel || 0, color: '#ff9800' }
    ];

    return (
        <Box>
            {fuelTypes.map((fuel) => (
                <Box key={fuel.name} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">{fuel.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1, mr: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={fuel.level}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#eee',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: fuel.color
                                    }
                                }}
                            />
                        </Box>
                        <Typography variant="body2">
                            {fuel.level}%
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default StockStatus; 