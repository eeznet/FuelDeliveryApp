import api from './apiService';

export const mapService = {
    // Initialize map with API key
    initMap: (mapRef, options = {}) => {
        const defaultOptions = {
            zoom: 12,
            center: { lat: -1.2921, lng: 36.8219 }, // Default to Nairobi
            ...options
        };

        return new window.google.maps.Map(mapRef.current, defaultOptions);
    },

    // Add marker to map
    addMarker: (map, position, options = {}) => {
        return new window.google.maps.Marker({
            position,
            map,
            ...options
        });
    },

    // Calculate route
    calculateRoute: async (origin, destination) => {
        const directionsService = new window.google.maps.DirectionsService();
        
        return new Promise((resolve, reject) => {
            directionsService.route(
                {
                    origin,
                    destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        resolve(result);
                    } else {
                        reject(new Error(`Failed to calculate route: ${status}`));
                    }
                }
            );
        });
    }
}; 