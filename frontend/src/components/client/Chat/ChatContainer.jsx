import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box, Typography, CircularProgress } from '@mui/material';
import ChatWindow from './ChatWindow';
import ChatContacts from './ChatContacts';
import { chatService } from '../../../services/chatService';
import { useWebSocket } from '../../../hooks/useWebSocket';

const ChatContainer = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useWebSocket();

    useEffect(() => {
        loadContacts();
        
        // Socket event listeners
        if (socket) {
            socket.on('new_message', handleNewMessage);
            socket.on('contact_status_change', handleContactStatusChange);
        }

        return () => {
            if (socket) {
                socket.off('new_message');
                socket.off('contact_status_change');
            }
        };
    }, [socket]);

    useEffect(() => {
        if (selectedContact) {
            loadChatHistory(selectedContact.id);
        }
    }, [selectedContact]);

    const loadContacts = async () => {
        try {
            const data = await chatService.getContacts();
            setContacts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading contacts:', error);
            setLoading(false);
        }
    };

    const loadChatHistory = async (contactId) => {
        try {
            const data = await chatService.getChatHistory(contactId);
            setMessages(data);
            await chatService.markAsRead(contactId);
            updateContactUnreadCount(contactId, 0);
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const handleNewMessage = (message) => {
        if (selectedContact?.id === message.senderId) {
            setMessages(prev => [...prev, message]);
            chatService.markAsRead(message.senderId);
        } else {
            updateContactUnreadCount(message.senderId, 1, true);
        }
    };

    const handleContactStatusChange = ({ userId, isOnline }) => {
        setContacts(prev => 
            prev.map(contact => 
                contact.id === userId 
                    ? { ...contact, isOnline } 
                    : contact
            )
        );
    };

    const updateContactUnreadCount = (contactId, count, increment = false) => {
        setContacts(prev =>
            prev.map(contact =>
                contact.id === contactId
                    ? {
                        ...contact,
                        unreadCount: increment
                            ? (contact.unreadCount || 0) + count
                            : count
                    }
                    : contact
            )
        );
    };

    const handleSendMessage = async (messageData) => {
        try {
            const sentMessage = await chatService.sendMessage(messageData);
            setMessages(prev => [...prev, sentMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <Paper sx={{ height: '600px', overflow: 'auto' }}>
                    <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        Contacts
                    </Typography>
                    <ChatContacts
                        contacts={contacts}
                        selectedContact={selectedContact}
                        onSelectContact={setSelectedContact}
                    />
                </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
                {selectedContact ? (
                    <ChatWindow
                        messages={messages}
                        recipient={selectedContact}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    <Paper sx={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="textSecondary">
                            Select a contact to start chatting
                        </Typography>
                    </Paper>
                )}
            </Grid>
        </Grid>
    );
};

export default ChatContainer; 