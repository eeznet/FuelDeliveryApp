import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from '../components/PrivateRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import Login from '../pages/Login';
import Register from '../pages/Register';

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
                        <PrivateRoute allowedRoles={['owner']}>
                            <OwnerDashboard />
                        </PrivateRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin/*"
                    element={
                        <PrivateRoute allowedRoles={['admin', 'owner']}>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />

                {/* Driver Routes */}
                <Route
                    path="/driver/*"
                    element={
                        <PrivateRoute allowedRoles={['driver']}>
                            <DriverDashboard />
                        </PrivateRoute>
                    }
                />

                {/* Client Routes */}
                <Route
                    path="/client/*"
                    element={
                        <PrivateRoute allowedRoles={['client']}>
                            <ClientDashboard />
                        </PrivateRoute>
                    }
                />

                {/* Placeholder Routes */}
                <Route
                    path="/supervisor/*"
                    element={
                        <PrivateRoute allowedRoles={['supervisor', 'owner']}>
                            <SupervisorDashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/finance/*"
                    element={
                        <PrivateRoute allowedRoles={['finance', 'owner']}>
                            <FinanceDashboard />
                        </PrivateRoute>
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