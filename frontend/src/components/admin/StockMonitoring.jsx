import React from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    Grid,
    Paper,
    Button
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const StockMonitoring = ({ stock }) => {
    const fuelTypes = [
        { name: '93 Octane', level: stock?.octane93 || 0, threshold: 20, color: '#2196f3' },
        { name: '95 Octane', level: stock?.octane95 || 0, threshold: 20, color: '#4caf50' },
        { name: 'Diesel', level: stock?.diesel || 0, threshold: 20, color: '#ff9800' }
    ];

    return (
        <Box>
            <Grid container spacing={2}>
                {fuelTypes.map((fuel) => (
                    <Grid item xs={12} key={fuel.name}>
                        <Paper sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle1">{fuel.name}</Typography>
                                {fuel.level < fuel.threshold && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                                        <WarningIcon sx={{ mr: 1 }} />
                                        <Typography variant="caption">Low Stock</Typography>
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
                            <Button 
                                variant="outlined" 
                                size="small"
                                fullWidth
                            >
                                Update Stock
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default StockMonitoring; 