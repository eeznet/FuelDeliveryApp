import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Paper,
    Typography,
    Box,
    Badge
} from '@mui/material';
import {
    Notifications as NotificationIcon,
    Warning as AlertIcon,
    Info as InfoIcon,
    Clear as ClearIcon
} from '@mui/icons-material';

const NotificationCenter = ({ notifications = [] }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'alert':
                return <AlertIcon color="error" />;
            case 'info':
                return <InfoIcon color="info" />;
            default:
                return <NotificationIcon color="primary" />;
        }
    };

    return (
        <Paper>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    Notifications
                    <Badge 
                        badgeContent={notifications.length} 
                        color="error" 
                        sx={{ ml: 1 }}
                    />
                </Typography>
            </Box>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {notifications.map((notification) => (
                    <ListItem
                        key={notification.id}
                        secondaryAction={
                            <IconButton edge="end" size="small">
                                <ClearIcon />
                            </IconButton>
                        }
                    >
                        <ListItemIcon>
                            {getIcon(notification.type)}
                        </ListItemIcon>
                        <ListItemText
                            primary={notification.title}
                            secondary={notification.message}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default NotificationCenter; 