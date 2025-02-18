import { useState, useEffect } from 'react';
import ownerService from '../services/ownerService';

export const useOwnerDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await ownerService.getDashboardData();
                setData(response);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Refresh function to manually refetch data
    const refresh = async () => {
        setLoading(true);
        try {
            const response = await ownerService.getDashboardData();
            setData(response);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, refresh };
}; 