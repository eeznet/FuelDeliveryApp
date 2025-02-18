import React, { useState, useRef, useEffect } from 'react';
import {
    Paper,
    Box,
    Typography,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Badge
} from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachIcon
} from '@mui/icons-material';

const ChatWindow = ({ messages, onSendMessage, recipient }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage({
                content: newMessage,
                recipientId: recipient.id,
                timestamp: new Date().toISOString()
            });
            setNewMessage('');
        }
    };

    return (
        <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6">
                    Chat with {recipient.name}
                </Typography>
                <Typography variant="caption">
                    {recipient.role}
                </Typography>
            </Box>

            {/* Messages List */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <List>
                    {messages.map((message, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                justifyContent: message.isSender ? 'flex-end' : 'flex-start'
                            }}
                        >
                            {!message.isSender && (
                                <ListItemAvatar>
                                    <Avatar src={recipient.avatar} />
                                </ListItemAvatar>
                            )}
                            <ListItemText
                                primary={message.content}
                                secondary={new Date(message.timestamp).toLocaleString()}
                                sx={{
                                    maxWidth: '70%',
                                    bgcolor: message.isSender ? 'primary.light' : 'grey.100',
                                    p: 2,
                                    borderRadius: 2
                                }}
                            />
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>

            {/* Message Input */}
            <Box
                component="form"
                onSubmit={handleSend}
                sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderTop: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    gap: 1
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
                />
                <IconButton color="primary">
                    <AttachIcon />
                </IconButton>
                <IconButton 
                    color="primary"
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
};

export default ChatWindow; 