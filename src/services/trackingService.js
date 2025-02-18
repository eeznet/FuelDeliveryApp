import api from './apiService';
import { io } from 'socket.io-client';
import { endpoints } from '../config/api';

class TrackingService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    initialize() {
        this.socket = io(API_BASE_URL, {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        this.socket.on('connect', () => {
            console.log('Connected to tracking server');
        });

        this.socket.on('error', (error) => {
            console.error('Tracking error:', error);
        });
    }

    startTracking(driverId) {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        driverId,
                        timestamp: new Date().toISOString()
                    };
                    this.socket.emit('location-update', location);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 5000
                }
            );
        }
    }

    subscribeToDriverLocation(driverId, callback) {
        this.socket.on(`driver-location-${driverId}`, callback);
        this.listeners.set(driverId, callback);
    }

    unsubscribeFromDriverLocation(driverId) {
        const callback = this.listeners.get(driverId);
        if (callback) {
            this.socket.off(`driver-location-${driverId}`, callback);
            this.listeners.delete(driverId);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export const trackingService = new TrackingService(); 