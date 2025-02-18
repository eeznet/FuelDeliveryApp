import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Button,
    Box
} from '@mui/material';
import { 
    Visibility as ViewIcon,
    Edit as EditIcon,
    Cancel as CancelIcon 
} from '@mui/icons-material';

const DeliveryManagement = ({ deliveries }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'in_progress': return 'primary';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const handleViewRoute = (deliveryId) => {
        // Implement route view logic
    };

    const handleEditDelivery = (deliveryId) => {
        // Implement edit logic
    };

    const handleCancelDelivery = (deliveryId) => {
        // Implement cancel logic
    };

    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <Button variant="contained" color="primary">
                    New Delivery
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Driver</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>ETA</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deliveries.map((delivery) => (
                            <TableRow key={delivery.id}>
                                <TableCell>{delivery.id}</TableCell>
                                <TableCell>{delivery.client}</TableCell>
                                <TableCell>{delivery.driver}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={delivery.status}
                                        color={getStatusColor(delivery.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{delivery.eta}</TableCell>
                                <TableCell>
                                    <IconButton 
                                        onClick={() => handleViewRoute(delivery.id)}
                                        color="primary"
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => handleEditDelivery(delivery.id)}
                                        color="info"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => handleCancelDelivery(delivery.id)}
                                        color="error"
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DeliveryManagement; 