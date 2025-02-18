import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useEmployees } from '../../hooks/useEmployees';

const EmployeeManagement = () => {
    const {
        employees,
        loading,
        error,
        addEmployee,
        updateEmployee,
        deleteEmployee
    } = useEmployees();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedEmployee(null);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'primary';
            case 'driver': return 'success';
            case 'supervisor': return 'warning';
            case 'finance': return 'info';
            default: return 'default';
        }
    };

    const handleAdd = async (data) => {
        try {
            await addEmployee(data);
            // Show success message
        } catch (err) {
            // Show error message
        }
    };

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5">Employee Management</Typography>
                        <Button
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={() => handleEdit(null)}
                        >
                            Add Employee
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Performance</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees?.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={employee.role}
                                                color={getRoleColor(employee.role)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={employee.status}
                                                color={employee.status === 'active' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography 
                                                color={employee.performance >= 80 ? 'success.main' : 'warning.main'}
                                            >
                                                {employee.performance}%
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleEdit(employee)}
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            defaultValue={selectedEmployee?.name}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            type="email"
                            defaultValue={selectedEmployee?.email}
                        />
                        <TextField
                            select
                            label="Role"
                            fullWidth
                            defaultValue={selectedEmployee?.role || 'driver'}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="driver">Driver</MenuItem>
                            <MenuItem value="supervisor">Supervisor</MenuItem>
                            <MenuItem value="finance">Finance</MenuItem>
                        </TextField>
                        <TextField
                            select
                            label="Status"
                            fullWidth
                            defaultValue={selectedEmployee?.status || 'active'}
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleClose}>
                        {selectedEmployee ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EmployeeManagement; 