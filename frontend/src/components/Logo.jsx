import React from 'react';
import { Typography } from '@mui/material';

const Logo = () => {
    return (
        <Typography 
            variant="h4" 
            sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                letterSpacing: 2,
                userSelect: 'none'
            }}
        >
            EEZNET
        </Typography>
    );
};

export default Logo; 