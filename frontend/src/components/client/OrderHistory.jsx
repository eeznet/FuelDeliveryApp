import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Box,
    Typography,
    Tooltip
} from '@mui/material';
import {
    Receipt as ReceiptIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const OrderHistory = ({ orders }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'warning';
            case 'confirmed': return 'info';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Fuel Type</TableCell>
                        <TableCell>Volume</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>
                                <Box>
                                    <Typography variant="body2">
                                        {new Date(order.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(order.date).toLocaleTimeString()}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>{order.fuelType}</TableCell>
                            <TableCell>{order.volume}L</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                                <Chip
                                    label={order.status}
                                    color={getStatusColor(order.status)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="View Invoice">
                                        <IconButton size="small" color="primary">
                                            <ReceiptIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Order Details">
                                        <IconButton size="small" color="info">
                                            <InfoIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OrderHistory; 