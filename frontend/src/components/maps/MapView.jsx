import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Loader } from '@googlemaps/js-api-loader';

const MapView = ({ deliveries, center = { lat: -1.2921, lng: 36.8219 } }) => {
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
            version: 'weekly'
        });

        loader.load().then(() => {
            const googleMap = new google.maps.Map(mapRef.current, {
                center,
                zoom: 12,
                styles: [
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    }
                ]
            });
            setMap(googleMap);
            setLoading(false);
        });
    }, []);

    // Update markers when deliveries change
    useEffect(() => {
        if (map && deliveries) {
            // Clear existing markers
            markers.forEach(marker => marker.setMap(null));
            
            // Create new markers
            const newMarkers = deliveries.map(delivery => {
                const marker = new google.maps.Marker({
                    position: delivery.location,
                    map,
                    title: `Delivery #${delivery.id}`,
                    icon: {
                        url: `/markers/${delivery.status}.png`,
                        scaledSize: new google.maps.Size(30, 30)
                    }
                });

                // Add info window
                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div>
                            <h3>Delivery #${delivery.id}</h3>
                            <p>Client: ${delivery.client}</p>
                            <p>Driver: ${delivery.driver}</p>
                            <p>Status: ${delivery.status}</p>
                        </div>
                    `
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });

                return marker;
            });

            setMarkers(newMarkers);
        }
    }, [map, deliveries]);

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

export default MapView; 