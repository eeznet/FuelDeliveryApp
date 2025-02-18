import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Divider,
    IconButton,
    Box
} from '@mui/material';
import { Reply as ReplyIcon } from '@mui/icons-material';

const MessageCenter = ({ messages }) => {
    const handleReply = (messageId) => {
        // Implement reply functionality
    };

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                    <ListItem
                        alignItems="flex-start"
                        secondaryAction={
                            <IconButton edge="end" onClick={() => handleReply(message.id)}>
                                <ReplyIcon />
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar>{message.sender[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography component="span" variant="subtitle2">
                                        {message.sender}
                                    </Typography>
                                    <Typography component="span" variant="caption" color="text.secondary">
                                        {message.time}
                                    </Typography>
                                </Box>
                            }
                            secondary={message.content}
                        />
                    </ListItem>
                    {index < messages.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
            ))}
        </List>
    );
};

export default MessageCenter; 