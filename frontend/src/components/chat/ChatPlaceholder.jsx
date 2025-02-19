import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const ChatPlaceholder = () => {
    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 4, 
                textAlign: 'center',
                maxWidth: 600,
                mx: 'auto',
                my: 4
            }}
        >
            <ChatIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
                Chat Feature Coming Soon!
            </Typography>
            <Typography color="text.secondary">
                In version 2.0, you'll be able to communicate directly with drivers, 
                owners, and support staff through our integrated chat system.
            </Typography>
            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="primary">
                    Coming in Version 2.0
                </Typography>
            </Box>
        </Paper>
    );
};

export default ChatPlaceholder; 