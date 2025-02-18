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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from '@mui/material';
import { Edit as EditIcon, Block as BlockIcon } from '@mui/icons-material';

const DriverManagement = ({ drivers }) => {
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleEdit = (driver) => {
        setSelectedDriver(driver);
        setDialogOpen(true);
    };

    const handleStatusChange = (driverId, newStatus) => {
        // Implement status change logic
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Current Delivery</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {drivers.map((driver) => (
                            <TableRow key={driver.id}>
                                <TableCell>{driver.name}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={driver.status}
                                        color={driver.status === 'active' ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>{driver.currentDelivery || 'None'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(driver)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleStatusChange(driver.id, 'blocked')}>
                                        <BlockIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Edit Driver</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={selectedDriver?.name || ''}
                    />
                    {/* Add more fields as needed */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DriverManagement; 