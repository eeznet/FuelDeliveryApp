import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleRoutes = {
    owner: [
        '/owner', '/admin', '/tracking', '/analytics', '/messages', 
        '/pricing', '/supervisor', '/finance'  // Owner can access all routes
    ],
    admin: [
        '/admin', '/tracking', '/analytics', '/messages',
        '/supervisor'  // Admin can access supervisor routes
    ],
    supervisor: [
        '/supervisor', '/tracking', '/schedule', 
        '/emergencies', '/drivers'
    ],
    finance: [
        '/finance', '/invoices', '/reports', 
        '/credit-limits', '/accounting'
    ],
    driver: ['/driver', '/deliveries', '/tracking'],
    client: ['/client', '/invoices', '/messages']
};

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const allowedRoutes = roleRoutes[user.role] || [];
    const isAllowed = allowedRoutes.some(route => location.pathname.startsWith(route));

    if (!isAllowed) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}; 