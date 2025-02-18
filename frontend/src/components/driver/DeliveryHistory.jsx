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
    Typography
} from '@mui/material';
import {
    CheckCircle as SuccessIcon,
    Cancel as FailedIcon,
    Info as InfoIcon
} from '@mui/icons-material';

const DeliveryHistory = ({ deliveries }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'failed': return 'error';
            case 'cancelled': return 'warning';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <SuccessIcon color="success" />;
            case 'failed': return <FailedIcon color="error" />;
            default: return <InfoIcon color="warning" />;
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>Order Details</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Rating</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                            <TableCell>{delivery.date}</TableCell>
                            <TableCell>{delivery.clientName}</TableCell>
                            <TableCell>
                                <Box>
                                    <Typography variant="body2">
                                        {delivery.fuelType} - {delivery.volume}L
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {delivery.address}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>{delivery.duration} mins</TableCell>
                            <TableCell>
                                <Chip
                                    icon={getStatusIcon(delivery.status)}
                                    label={delivery.status}
                                    color={getStatusColor(delivery.status)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {delivery.rating}
                                    <IconButton size="small" color="warning">
                                        ★
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DeliveryHistory; 