import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from '@mui/material';

const DeliveryTable = ({ deliveries }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'in_progress': return 'warning';
            case 'pending': return 'info';
            default: return 'default';
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>Driver</TableCell>
                        <TableCell>Fuel Type</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Delivery Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                            <TableCell>{delivery.id}</TableCell>
                            <TableCell>{delivery.client}</TableCell>
                            <TableCell>{delivery.driver}</TableCell>
                            <TableCell>{delivery.fuelType}</TableCell>
                            <TableCell>{delivery.quantity}L</TableCell>
                            <TableCell>
                                <Chip 
                                    label={delivery.status}
                                    color={getStatusColor(delivery.status)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{delivery.deliveryTime}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DeliveryTable; 