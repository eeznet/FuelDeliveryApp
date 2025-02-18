import { useState, useEffect, useCallback } from 'react';
import driverService from '../services/driverService';

export const useLocationTracking = (isActive = false) => {
    const [location, setLocation] = useState(null);
    const [watchId, setWatchId] = useState(null);
    const [error, setError] = useState(null);

    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        const id = navigator.geolocation.watchPosition(
            async (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date().toISOString()
                };

                setLocation(newLocation);

                try {
                    await driverService.updateLocation(newLocation);
                } catch (err) {
                    console.error('Failed to update location:', err);
                    // Continue tracking even if server update fails
                }
            },
            (err) => {
                setError(`Location error: ${err.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        setWatchId(id);
    }, []);

    const stopTracking = useCallback(() => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
    }, [watchId]);

    useEffect(() => {
        if (isActive) {
            startTracking();
        } else {
            stopTracking();
        }

        return () => stopTracking();
    }, [isActive, startTracking, stopTracking]);

    return { location, error, isTracking: !!watchId };
}; 