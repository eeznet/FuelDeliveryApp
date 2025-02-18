import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Chip,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    LocalShipping,
    LocationOn,
    Person,
    Phone,
    Notes
} from '@mui/icons-material';

const deliverySteps = [
    'Accepted',
    'En Route',
    'Arrived',
    'Delivering',
    'Completed'
];

const ActiveDelivery = ({ delivery, onStatusUpdate }) => {
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [notes, setNotes] = useState('');
    const [activeStep, setActiveStep] = useState(
        deliverySteps.indexOf(delivery.status)
    );

    const handleNext = () => {
        const nextStep = activeStep + 1;
        if (nextStep === deliverySteps.length - 1) {
            setConfirmDialog(true);
        } else {
            setActiveStep(nextStep);
            onStatusUpdate(delivery.id, deliverySteps[nextStep]);
        }
    };

    const handleComplete = () => {
        onStatusUpdate(delivery.id, 'completed', notes);
        setConfirmDialog(false);
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Active Delivery
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Person sx={{ mr: 1 }} />
                        <Typography>
                            Client: {delivery.clientName}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Phone sx={{ mr: 1 }} />
                        <Typography>
                            Contact: {delivery.clientPhone}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocalShipping sx={{ mr: 1 }} />
                        <Typography>
                            Order: {delivery.fuelType} - {delivery.volume}L
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ mr: 1 }} />
                        <Typography>
                            Destination: {delivery.address}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                {deliverySteps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={activeStep === deliverySteps.length - 1}
                >
                    {activeStep === deliverySteps.length - 2 ? 'Complete' : 'Next Step'}
                </Button>
            </Box>

            <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
                <DialogTitle>Complete Delivery</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Delivery Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
                    <Button onClick={handleComplete} variant="contained">
                        Complete Delivery
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ActiveDelivery; 