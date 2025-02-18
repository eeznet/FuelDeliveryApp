import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { chatService } from '../services/chatService';

export const useChat = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useWebSocket();

    const loadContacts = useCallback(async () => {
        try {
            const data = await chatService.getContacts();
            setContacts(data);
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    }, []);

    const loadMessages = useCallback(async (contactId) => {
        if (!contactId) return;
        try {
            const data = await chatService.getChatHistory(contactId);
            setMessages(data);
            await chatService.markAsRead(contactId);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }, []);

    const sendMessage = useCallback(async (content) => {
        if (!selectedContact) return;
        try {
            const message = await chatService.sendMessage({
                recipientId: selectedContact.id,
                content
            });
            setMessages(prev => [...prev, message]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }, [selectedContact]);

    useEffect(() => {
        loadContacts();
        
        if (socket) {
            socket.on('new_message', (message) => {
                if (selectedContact?.id === message.senderId) {
                    setMessages(prev => [...prev, message]);
                    chatService.markAsRead(message.senderId);
                } else {
                    setContacts(prev => 
                        prev.map(contact => 
                            contact.id === message.senderId
                                ? { ...contact, unreadCount: (contact.unreadCount || 0) + 1 }
                                : contact
                        )
                    );
                }
            });

            socket.on('user_status', ({ userId, status }) => {
                setContacts(prev => 
                    prev.map(contact => 
                        contact.id === userId
                            ? { ...contact, isOnline: status === 'online' }
                            : contact
                    )
                );
            });
        }

        return () => {
            if (socket) {
                socket.off('new_message');
                socket.off('user_status');
            }
        };
    }, [socket, selectedContact, loadContacts]);

    useEffect(() => {
        if (selectedContact) {
            loadMessages(selectedContact.id);
        }
    }, [selectedContact, loadMessages]);

    return {
        contacts,
        selectedContact,
        messages,
        loading,
        setSelectedContact,
        sendMessage
    };
}; 