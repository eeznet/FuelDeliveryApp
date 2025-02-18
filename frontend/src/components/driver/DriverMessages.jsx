import React, { useState } from 'react';
import {
    Paper,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    TextField,
    Button,
    Divider,
    Tab,
    Tabs,
    IconButton,
    Badge
} from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachIcon,
    SupervisorAccount as SupervisorIcon,
    BusinessCenter as OwnerIcon
} from '@mui/icons-material';

const DriverMessages = ({ messages, onSendMessage }) => {
    const [activeTab, setActiveTab] = useState('supervisor');
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage({
                recipient: activeTab,
                content: newMessage,
                timestamp: new Date().toISOString()
            });
            setNewMessage('');
        }
    };

    const getUnreadCount = (type) => {
        return messages.filter(m => m.recipient === type && !m.read).length;
    };

    return (
        <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            {/* Message Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
                >
                    <Tab 
                        label={
                            <Badge badgeContent={getUnreadCount('supervisor')} color="error">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SupervisorIcon sx={{ mr: 1 }} />
                                    Supervisor
                                </Box>
                            </Badge>
                        }
                        value="supervisor"
                    />
                    <Tab 
                        label={
                            <Badge badgeContent={getUnreadCount('owner')} color="error">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <OwnerIcon sx={{ mr: 1 }} />
                                    Owner
                                </Box>
                            </Badge>
                        }
                        value="owner"
                    />
                </Tabs>
            </Box>

            {/* Messages List */}
            <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {messages
                    .filter(msg => msg.recipient === activeTab)
                    .map((message, index) => (
                        <React.Fragment key={message.id}>
                            <ListItem 
                                alignItems="flex-start"
                                sx={{ 
                                    flexDirection: message.fromDriver ? 'row-reverse' : 'row',
                                    mb: 2 
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar 
                                        src={message.avatar}
                                        sx={{ 
                                            bgcolor: message.fromDriver ? 'primary.main' : 'secondary.main'
                                        }}
                                    >
                                        {message.sender[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography 
                                            variant="subtitle2"
                                            align={message.fromDriver ? 'right' : 'left'}
                                        >
                                            {message.sender}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box 
                                            sx={{ 
                                                bgcolor: message.fromDriver ? 'primary.light' : 'grey.100',
                                                p: 2,
                                                borderRadius: 2,
                                                maxWidth: '80%',
                                                ml: message.fromDriver ? 'auto' : 0,
                                                mr: message.fromDriver ? 0 : 'auto'
                                            }}
                                        >
                                            <Typography 
                                                variant="body2"
                                                color={message.fromDriver ? 'white' : 'text.primary'}
                                            >
                                                {message.content}
                                            </Typography>
                                            <Typography 
                                                variant="caption"
                                                color={message.fromDriver ? 'white' : 'text.secondary'}
                                                sx={{ display: 'block', mt: 1 }}
                                            >
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index < messages.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
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

export default DriverMessages; 