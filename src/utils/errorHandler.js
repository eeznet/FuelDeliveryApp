export const handleApiError = (error) => {
    // Authentication Errors
    if (error.response?.status === 401) {
        return {
            message: 'Please login again to continue',
            status: 401,
            type: 'AUTH_ERROR'
        };
    }

    if (error.response?.status === 403) {
        return {
            message: 'You do not have permission to perform this action',
            status: 403,
            type: 'PERMISSION_ERROR'
        };
    }

    // Validation Errors
    if (error.response?.status === 400) {
        return {
            message: error.response.data.message || 'Invalid input',
            status: 400,
            type: 'VALIDATION_ERROR',
            details: error.response.data.details
        };
    }

    // Server Errors
    if (error.response?.status >= 500) {
        return {
            message: 'Server error. Please try again later',
            status: error.response.status,
            type: 'SERVER_ERROR'
        };
    }

    // Network Errors
    if (error.message === 'Network Error') {
        return {
            message: 'Unable to connect to server. Please check your internet connection',
            status: 0,
            type: 'NETWORK_ERROR'
        };
    }

    // Default Error
    return {
        message: error.message || 'An unexpected error occurred',
        status: error.response?.status || 500,
        type: 'UNKNOWN_ERROR'
    };
}; 