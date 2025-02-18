import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Paper,
    Box,
    Chip,
    Divider
} from '@mui/material';
import {
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Schedule as PendingIcon
} from '@mui/icons-material';

const OrderQueue = ({ orders }) => {
    const handleApprove = (orderId) => {
        // Implement approve logic
    };

    const handleReject = (orderId) => {
        // Implement reject logic
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'default';
        }
    };

    return (
        <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List>
                {orders.length === 0 ? (
                    <ListItem>
                        <ListItemText 
                            primary="No pending orders"
                            secondary="All orders have been processed"
                        />
                    </ListItem>
                ) : (
                    orders.map((order, index) => (
                        <React.Fragment key={order.id}>
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle2">
                                                Order #{order.id}
                                            </Typography>
                                            <Chip
                                                label={order.priority}
                                                color={getPriorityColor(order.priority)}
                                                size="small"
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.primary">
                                                {order.client}
                                            </Typography>
                                            {` — ${order.fuelType}, ${order.quantity}L`}
                                            <Box sx={{ mt: 1 }}>
                                                <PendingIcon fontSize="small" sx={{ mr: 1 }} />
                                                <Typography variant="caption">
                                                    Requested: {order.requestTime}
                                                </Typography>
                                            </Box>
                                        </>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton 
                                        edge="end" 
                                        color="success"
                                        onClick={() => handleApprove(order.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        <ApproveIcon />
                                    </IconButton>
                                    <IconButton 
                                        edge="end" 
                                        color="error"
                                        onClick={() => handleReject(order.id)}
                                    >
                                        <RejectIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            {index < orders.length - 1 && <Divider />}
                        </React.Fragment>
                    ))
                )}
            </List>
        </Paper>
    );
};

export default OrderQueue; 