import { useState } from 'react';
import { authService } from '../services/authService';
import { handleApiError } from '../utils/errorHandler';

export const Login = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const credentials = {
                email: e.target.email.value,
                password: e.target.password.value
            };

            const response = await authService.login(credentials);
            // Handle successful login
            window.location.href = '/dashboard';
        } catch (err) {
            const errorDetails = handleApiError(err);
            setError(errorDetails.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Your login form JSX
    );
}; 