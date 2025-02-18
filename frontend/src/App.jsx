import ChatPlaceholder from './components/chat/ChatPlaceholder';

// ... in your routes configuration
{
    path: "/chat",
    element: <ChatPlaceholder />,
    roles: ['owner', 'client', 'driver']
} 