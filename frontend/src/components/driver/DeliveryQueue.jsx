import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Chip,
    Box,
    Divider
} from '@mui/material';
import {
    Visibility as ViewIcon,
    LocalShipping as TruckIcon,
    Schedule as TimeIcon
} from '@mui/icons-material';

const DeliveryQueue = ({ deliveries, onDeliverySelect }) => {
    return (
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {deliveries.length === 0 ? (
                <ListItem>
                    <ListItemText 
                        primary="No pending deliveries"
                        secondary="Your queue is empty"
                    />
                </ListItem>
            ) : (
                deliveries.map((delivery, index) => (
                    <React.Fragment key={delivery.id}>
                        <ListItem>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TruckIcon fontSize="small" color="primary" />
                                        <Typography variant="subtitle2">
                                            {delivery.clientName}
                                        </Typography>
                                    </Box>
                                }
                                secondary={
                                    <Box sx={{ mt: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <Chip 
                                                label={`${delivery.fuelType} - ${delivery.volume}L`}
                                                size="small"
                                                color="primary"
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <TimeIcon fontSize="small" color="action" />
                                            <Typography variant="caption">
                                                ETA: {delivery.estimatedTime}
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton 
                                    edge="end" 
                                    onClick={() => onDeliverySelect(delivery)}
                                >
                                    <ViewIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {index < deliveries.length - 1 && <Divider />}
                    </React.Fragment>
                ))
            )}
        </List>
    );
};

export default DeliveryQueue; 