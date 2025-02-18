import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const AboutUs = () => {
    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    About Us
                </Typography>
                <Box sx={{ my: 2 }}>
                    <Typography paragraph>
                        Welcome to Fuel Delivery Web-App, your trusted partner in fuel delivery solutions.
                    </Typography>
                    <Typography paragraph>
                        Our mission is to provide efficient and reliable fuel delivery services to our valued customers.
                    </Typography>
                    <Typography paragraph>
                        With years of experience in the industry, we have built a reputation for excellence in service delivery and customer satisfaction.
                    </Typography>
                </Box>
                {/* Placeholder for more content */}
            </Paper>
        </Container>
    );
};

export default AboutUs; 