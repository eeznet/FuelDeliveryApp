import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Badge,
    Divider,
    Typography,
    Box
} from '@mui/material';

const ChatContacts = ({ contacts, selectedContact, onSelectContact }) => {
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {contacts.map((contact, index) => (
                <React.Fragment key={contact.id}>
                    <ListItem
                        button
                        selected={selectedContact?.id === contact.id}
                        onClick={() => onSelectContact(contact)}
                    >
                        <ListItemAvatar>
                            <Badge
                                color="success"
                                variant="dot"
                                invisible={!contact.isOnline}
                            >
                                <Avatar src={contact.avatar}>
                                    {contact.name[0]}
                                </Avatar>
                            </Badge>
                        </ListItemAvatar>
                        <ListItemText
                            primary={contact.name}
                            secondary={
                                <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {contact.role}
                                    </Typography>
                                    {contact.unreadCount > 0 && (
                                        <Badge
                                            badgeContent={contact.unreadCount}
                                            color="primary"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                </Box>
                            }
                        />
                    </ListItem>
                    {index < contacts.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
            ))}
        </List>
    );
};

export default ChatContacts; 