import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Link,
    Box,
    Alert,
    MenuItem
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'client'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Register
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            margin="normal"
                            required
                        />
                        <TextField
                            select
                            fullWidth
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            margin="normal"
                            required
                        >
                            <MenuItem value="client">Client</MenuItem>
                            <MenuItem value="driver">Driver</MenuItem>
                        </TextField>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                        >
                            Register
                        </Button>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography>
                                Already have an account?{' '}
                                <Link component={RouterLink} to="/login">
                                    Login here
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register; 