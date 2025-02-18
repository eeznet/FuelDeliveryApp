import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const ConsumptionReports = ({ consumptionData, forecastData }) => {
    const [timeRange, setTimeRange] = useState('month');

    const ranges = [
        { value: 'week', label: 'Last Week' },
        { value: 'month', label: 'Last Month' },
        { value: 'quarter', label: 'Last Quarter' },
        { value: 'year', label: 'Last Year' }
    ];

    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                    Consumption Analysis
                </Typography>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        label="Time Range"
                    >
                        {ranges.map((range) => (
                            <MenuItem key={range.value} value={range.value}>
                                {range.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                        Historical Consumption
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={consumptionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="consumption" 
                                stroke="#8884d8" 
                                name="Liters"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                        Consumption Forecast
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={forecastData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="forecast" 
                                stroke="#82ca9d" 
                                name="Predicted Liters"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ConsumptionReports; 