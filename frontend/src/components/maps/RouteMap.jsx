import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Loader } from '@googlemaps/js-api-loader';

const RouteMap = ({ origin, destination, waypoints = [] }) => {
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [map, setMap] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
            version: 'weekly',
            libraries: ['places']
        });

        loader.load().then(() => {
            const googleMap = new google.maps.Map(mapRef.current, {
                center: origin,
                zoom: 12
            });
            
            const renderer = new google.maps.DirectionsRenderer({
                map: googleMap,
                suppressMarkers: false
            });

            setMap(googleMap);
            setDirectionsRenderer(renderer);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (map && directionsRenderer && origin && destination) {
            const directionsService = new google.maps.DirectionsService();

            const request = {
                origin,
                destination,
                waypoints: waypoints.map(point => ({
                    location: point,
                    stopover: true
                })),
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                }
            });
        }
    }, [map, directionsRenderer, origin, destination, waypoints]);

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100%' 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box 
            ref={mapRef} 
            sx={{ 
                width: '100%', 
                height: '100%',
                minHeight: '400px'
            }} 
        />
    );
};

export default RouteMap; 