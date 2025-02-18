import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Role-based Dashboards
import OwnerDashboard from '../pages/dashboards/OwnerDashboard';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import DriverDashboard from '../pages/dashboards/DriverDashboard';
import ClientDashboard from '../pages/dashboards/ClientDashboard';
import SupervisorDashboard from '../pages/dashboards/SupervisorDashboard';
import FinanceDashboard from '../pages/dashboards/FinanceDashboard';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<DashboardLayout />}>
                {/* Owner Routes */}
                <Route
                    path="/owner/*"
                    element={
                        <ProtectedRoute allowedRoles={['owner']}>
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'owner']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Driver Routes */}
                <Route
                    path="/driver/*"
                    element={
                        <ProtectedRoute allowedRoles={['driver']}>
                            <DriverDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Client Routes */}
                <Route
                    path="/client/*"
                    element={
                        <ProtectedRoute allowedRoles={['client']}>
                            <ClientDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Placeholder Routes */}
                <Route
                    path="/supervisor/*"
                    element={
                        <ProtectedRoute allowedRoles={['supervisor', 'owner']}>
                            <SupervisorDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/finance/*"
                    element={
                        <ProtectedRoute allowedRoles={['finance', 'owner']}>
                            <FinanceDashboard />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Redirect based on role */}
            <Route
                path="/"
                element={
                    <Navigate
                        to={
                            user?.role === 'owner'
                                ? '/owner'
                                : user?.role === 'admin'
                                ? '/admin'
                                : user?.role === 'driver'
                                ? '/driver'
                                : user?.role === 'client'
                                ? '/client'
                                : '/login'
                        }
                    />
                }
            />
        </Routes>
    );
};

export default AppRoutes; 