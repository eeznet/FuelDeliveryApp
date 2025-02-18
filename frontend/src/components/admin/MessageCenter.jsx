import React, { useState } from 'react';
import {
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    TextField,
    Button,
    Divider,
    IconButton
} from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachIcon,
    Star as StarIcon
} from '@mui/icons-material';

const MessageCenter = ({ messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            {/* Messages Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">Messages from Owner</Typography>
            </Box>

            {/* Messages List */}
            <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {messages.map((message) => (
                    <ListItem 
                        key={message.id}
                        alignItems="flex-start"
                        sx={{ 
                            flexDirection: message.fromOwner ? 'row' : 'row-reverse',
                            mb: 2 
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar 
                                src={message.avatar}
                                sx={{ 
                                    bgcolor: message.fromOwner ? 'primary.main' : 'secondary.main'
                                }}
                            >
                                {message.sender[0]}
                            </Avatar>
                        </ListItemAvatar>
                        <Box
                            sx={{
                                maxWidth: '70%',
                                bgcolor: message.fromOwner ? 'grey.100' : 'primary.light',
                                borderRadius: 2,
                                p: 2,
                                color: message.fromOwner ? 'text.primary' : 'white'
                            }}
                        >
                            <Typography variant="subtitle2">{message.sender}</Typography>
                            <Typography variant="body1">{message.content}</Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                {message.timestamp}
                            </Typography>
                        </Box>
                        {message.important && (
                            <StarIcon color="warning" sx={{ ml: 1 }} />
                        )}
                    </ListItem>
                ))}
            </List>

            {/* Message Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                        <AttachIcon />
                    </IconButton>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                    >
                        Send
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default MessageCenter; 