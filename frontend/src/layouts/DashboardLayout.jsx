import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const DashboardLayout = () => {
    return (
        <Box>
            <Outlet />
        </Box>
    );
};

export default DashboardLayout; 