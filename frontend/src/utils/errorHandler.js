import { toast } from 'react-toastify';

export class ApiError extends Error {
    constructor(message, status, code) {
        super(message);
        this.status = status;
        this.code = code;
        this.name = 'ApiError';
    }
}

export const errorHandler = {
    handle: (error, options = {}) => {
        const {
            showToast = true,
            logToServer = true,
            retry = null
        } = options;

        // Log error to console
        console.error('Error occurred:', error);

        // Show user-friendly message
        if (showToast) {
            let message = 'An unexpected error occurred';

            if (error instanceof ApiError) {
                switch (error.status) {
                    case 401:
                        message = 'Session expired. Please login again.';
                        // Redirect to login
                        window.location.href = '/login';
                        break;
                    case 403:
                        message = 'You do not have permission to perform this action';
                        break;
                    case 404:
                        message = 'The requested resource was not found';
                        break;
                    case 429:
                        message = 'Too many requests. Please try again later';
                        break;
                    default:
                        message = error.message || message;
                }
            }

            toast.error(message);
        }

        // Log to server
        if (logToServer) {
            // Implement server logging
            const logData = {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                // Add any relevant context
                url: window.location.href,
                userAgent: navigator.userAgent
            };

            // Send to logging endpoint
            fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logData)
            }).catch(console.error); // Don't throw if logging fails
        }

        // Retry logic
        if (retry && typeof retry === 'function') {
            setTimeout(retry, 1000); // Retry after 1 second
        }
    },

    // Retry mechanism with exponential backoff
    retry: async (fn, maxAttempts = 3) => {
        let attempt = 0;
        while (attempt < maxAttempts) {
            try {
                return await fn();
            } catch (error) {
                attempt++;
                if (attempt === maxAttempts) {
                    throw error;
                }
                // Exponential backoff
                await new Promise(resolve => 
                    setTimeout(resolve, Math.pow(2, attempt) * 1000)
                );
            }
        }
    }
}; 