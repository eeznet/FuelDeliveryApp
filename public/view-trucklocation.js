document.addEventListener('DOMContentLoaded', () => {
    const loadLocationButton = document.getElementById('loadLocationButton');
    const locationContainer = document.getElementById('location');

    // Set up ARIA live region for dynamic updates
    locationContainer.setAttribute('aria-live', 'polite');

    // Function to update button state (loading / idle)
    const updateButtonState = (isLoading) => {
        if (isLoading) {
            loadLocationButton.disabled = true;  // Disable the button while loading
            loadLocationButton.setAttribute('aria-busy', 'true'); // ARIA attribute for busy state
            loadLocationButton.innerHTML = 'Loading...'; // Change button text
        } else {
            loadLocationButton.disabled = false;  // Re-enable the button after loading
            loadLocationButton.setAttribute('aria-busy', 'false'); // Remove ARIA busy state
            loadLocationButton.innerHTML = 'Load Location'; // Reset button text
        }
    };

    // Function to load truck location
    const loadTruckLocation = async () => {
        locationContainer.innerHTML = '<p>Loading location...</p>'; // Show loading state
        updateButtonState(true); // Update button state to loading

        try {
            const response = await fetch('/api/truck-location');

            if (!response.ok) {
                throw new Error('Failed to fetch truck location');
            }

            const data = await response.json();

            // Check if location data is available
            if (data.latitude && data.longitude) {
                locationContainer.innerHTML = `
                    <p><strong>Latitude:</strong> ${data.latitude}</p>
                    <p><strong>Longitude:</strong> ${data.longitude}</p>
                    <p><strong>Last Updated:</strong> ${new Date(data.updatedAt).toLocaleString()}</p>
                `;
            } else {
                locationContainer.innerHTML = '<p>No location data available.</p>';
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            locationContainer.innerHTML = `
                <p class="error-message">Error fetching location data. Please try again later.</p>
            `;
        } finally {
            updateButtonState(false); // Reset button state
        }
    };

    // Debounce function to prevent multiple clicks in quick succession
    let debounceTimer;
    const debounceLoadLocation = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            loadTruckLocation();
        }, 1000); // Allow the user to click once per second
    };

    // Attach event listener to the button
    loadLocationButton.addEventListener('click', debounceLoadLocation);
});
