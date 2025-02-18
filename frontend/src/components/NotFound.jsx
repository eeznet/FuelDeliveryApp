import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh'
            }}>
                <Typography variant="h2" gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Page Not Found
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                >
                    Go Home
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound; 