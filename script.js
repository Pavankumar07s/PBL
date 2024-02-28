mapboxgl.accessToken = 'pk.eyJ1IjoiaGFubmFod3JpZ2h0MTIzIiwiYSI6ImNsc2FvaXpueTA1dDAyanFtemplcHdyd24ifQ.xDVluCTEF9lX4dYC8DHglQ';
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true
});

function successLocation(position) {
  const userCoordinates = [position.coords.longitude, position.coords.latitude];
  
  // Search for nearby petrol pumps using Mapbox Places API
  searchNearbyPetrolPumps(userCoordinates);
}

function errorLocation(error) {
  console.error('Error getting geolocation:', error);
  alert('Geolocation is not available. Defaulting to a predefined location.');
  setupMap([73.87521,18.60650]); // Default to a predefined location
}

function searchNearbyPetrolPumps(coordinates) {
  const radius = 200000; // 200km in meters
  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/petrol%20station.json?proximity=${coordinates[0]},${coordinates[1]}&access_token=${mapboxgl.accessToken}&limit=10`;
  
  // Make a request to the Mapbox Places API
  fetch(endpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Extract petrol pump coordinates from the response
      const petrolPumps = data.features.map(feature => {
        return {
          coordinates: feature.geometry.coordinates,
          name: feature.properties.name
        };
      });
      
      // Add petrol pumps as checkpoints for the journey
      addCheckpoints(coordinates, petrolPumps);
    })
    .catch(error => {
      console.error('Error searching nearby petrol pumps:', error);
      alert('Error searching nearby petrol pumps.');
    });
}

function addCheckpoints(start, checkpoints) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: start,
    zoom: 10 // Adjust the initial zoom level as needed
  });

  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav);

  // Convert petrol pump coordinates to waypoints
  const waypoints = checkpoints.map(checkpoint => {
    return { coordinates: checkpoint.coordinates, name: checkpoint.name };
  });

  // Initialize the MapboxDirections control with start and end points
  var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    waypoints: [
      { coordinates: start, name: 'Start' },
      ...waypoints
    ],
    unit: 'metric'
  });

  map.addControl(directions, 'top-left');
}



  // Display information of petrol pumps
  const infoContainer = document.createElement('div');
  infoContainer.className = 'info-container';

  checkpoints.forEach((checkpoint, index) => {
    const checkpointInfo = document.createElement('div');
    checkpointInfo.className = 'checkpoint-info';
    checkpointInfo.innerHTML = `<strong>${index + 1}. ${checkpoint.name}</strong><br>Coordinates: ${checkpoint.coordinates[1]}, ${checkpoint.coordinates[0]}`;

    infoContainer.appendChild(checkpointInfo);
  });

  mapContainer.appendChild(infoContainer);
