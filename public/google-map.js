console.log('Google Maps script loaded');

// Function to initialize the Google Map
function initMap() {
    // Default center for the map (San Francisco as a fallback)
    const defaultLocation = { lat: 37.7749, lng: -122.4194 };

    // Create a new map instance and set its options
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultLocation,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    // Array to keep track of truck markers
    const truckMarkers = [];

    // Function to create or update a truck marker
    function updateTruckMarker(truckId, lat, lng) {
        const newLocation = { lat, lng };
        const truckMarker = truckMarkers.find(marker => marker.truckId === truckId);

        if (truckMarker) {
            // Update existing marker
            truckMarker.marker.setPosition(newLocation);
            truckMarker.marker.setTitle(`Truck ${truckId} Location`);
        } else {
            // Create new marker if not already on the map
            const marker = new google.maps.Marker({
                position: newLocation,
                map: map,
                title: `Truck ${truckId} Location`,
            });
            truckMarkers.push({ truckId, marker });
        }

        map.setCenter(newLocation); // Re-center the map to the latest truck location
    }

    // Periodically update truck's location (every 10 seconds for demo purposes)
    setInterval(() => {
        fetchTruckLocation(); // Simulate a call to fetch truck's live location
    }, 10000);

    // Fetch truck location from the backend API
    async function fetchTruckLocation() {
        try {
            const response = await fetch('/api/truck-location'); // Adjust the endpoint based on your setup
            const data = await response.json();

            if (response.ok) {
                // Assuming the response contains multiple trucks' locations
                data.forEach(truck => {
                    const { truckId, latitude, longitude } = truck;
                    console.log(`Truck ${truckId} location updated:`, latitude, longitude);
                    updateTruckMarker(truckId, latitude, longitude);
                });
            } else {
                handleError('Failed to fetch truck locations. Please try again later.');
            }
        } catch (error) {
            handleError('Error occurred while fetching truck locations. Please try again.');
        }
    }

    // Handle geolocation to center the map based on user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map.setCenter(userLocation); // Center the map to the user's current location
        }, () => {
            handleError('Geolocation failed. Default location displayed.');
        });
    }

    // General error handling function
    function handleError(message) {
        console.error(message);
        displayErrorMessage(message);
    }

    // Display error messages in a user-friendly way
    function displayErrorMessage(message) {
        const errorDiv = document.getElementById('errorMessages');
        errorDiv.innerHTML = `<p class="error">${message}</p>`;
        errorDiv.style.color = 'red';
        errorDiv.style.display = 'block'; // Ensure error message is visible
        setTimeout(() => {
            errorDiv.style.display = 'none'; // Hide error message after 5 seconds
        }, 5000);
    }
}

// Load the Google Maps script dynamically with your API key
function loadGoogleMapsScript() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${window.GOOGLE_MAPS_API_KEY}&callback=initMap`; // Use a global variable for the key
    script.async = true;
    script.onerror = function() {
        console.error('Failed to load Google Maps script.');
        displayErrorMessage('Failed to load Google Maps. Please try again later.');
    };
    document.body.appendChild(script);
}

// Call the function to load the Google Maps script when the page is ready
window.onload = loadGoogleMapsScript;
