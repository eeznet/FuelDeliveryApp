import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch
} from '@mui/material';
import { admin } from '../services/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersResponse, statsResponse] = await Promise.all([
                admin.getUsers(),
                admin.getStats()
            ]);
            setUsers(usersResponse.data);
            setStats(statsResponse.data);
        } catch (err) {
            setError('Failed to load dashboard data');
        }
    };

    const handleToggleUserStatus = async (userId, isActive) => {
        try {
            await admin.updateUser(userId, { is_active: !isActive });
            setSuccess('User status updated successfully');
            loadData();
        } catch (err) {
            setError('Failed to update user status');
        }
    };

    return (
        <Container>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>System Statistics</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4">{stats.totalUsers}</Typography>
                                    <Typography color="textSecondary">Total Users</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4">{stats.activeDrivers}</Typography>
                                    <Typography color="textSecondary">Active Drivers</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4">{stats.totalOrders}</Typography>
                                    <Typography color="textSecondary">Total Orders</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box textAlign="center">
                                    <Typography variant="h4">{stats.pendingDeliveries}</Typography>
                                    <Typography color="textSecondary">Pending Deliveries</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>User Management</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={user.is_active}
                                                    onChange={() => handleToggleUserStatus(user.id, user.is_active)}
                                                    color="primary"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboard; 