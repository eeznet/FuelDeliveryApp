import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Fuel Delivery Web-App
                </Typography>
                <Box>
                    {!user ? (
                        <>
                            <Button 
                                color="inherit" 
                                component={RouterLink} 
                                to="/about"
                            >
                                About Us
                            </Button>
                            <Button 
                                color="inherit" 
                                component={RouterLink} 
                                to="/contact"
                            >
                                Contact Us
                            </Button>
                            <Button 
                                color="inherit" 
                                component={RouterLink} 
                                to="/login"
                            >
                                Login
                            </Button>
                        </>
                    ) : (
                        <Button 
                            color="inherit" 
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 