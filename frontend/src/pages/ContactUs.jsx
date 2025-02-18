import React from 'react';
import { 
    Container, 
    Typography, 
    Paper, 
    Box,
    Grid,
    TextField,
    Button,
    Alert
} from '@mui/material';

const ContactUs = () => {
    const [status, setStatus] = React.useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus({ type: 'info', message: 'Message functionality coming soon!' });
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Contact Us
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Name"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Message"
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                            >
                                Send Message
                            </Button>
                        </Grid>
                    </Grid>
                    {status && (
                        <Alert severity={status.type} sx={{ mt: 2 }}>
                            {status.message}
                        </Alert>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ContactUs; 