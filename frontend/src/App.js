import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './theme';
import NotFound from './components/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <BrowserRouter>
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Navigate to="/dashboard" replace />} />
                                <Route
                                    path="dashboard"
                                    element={
                                        <PrivateRoute>
                                            <DashboardRouter />
                                        </PrivateRoute>
                                    }
                                />
                            </Route>
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </ErrorBoundary>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

function DashboardRouter() {
    const { user } = useAuth();

    switch (user.role) {
        case 'client':
            return <ClientDashboard />;
        case 'driver':
            return <DriverDashboard />;
        case 'admin':
            return <AdminDashboard />;
        case 'owner':
            return <OwnerDashboard />;
        default:
            return <Navigate to="/login" replace />;
    }
}

export default App; 