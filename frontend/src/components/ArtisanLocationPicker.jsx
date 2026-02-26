import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issues in React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// This helper component moves the map view when a location is selected
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 15);
  }, [coords, map]);
  return null;
}

const ArtisanLocationPicker = ({ onLocationSelect, initialAddress }) => {
  const [query, setQuery] = useState(initialAddress || "");
  const [results, setResults] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState([6.5244, 3.3792]); // Default to Lagos
  const [isSearching, setIsSearching] = useState(false);

  // Search logic for Nominatim (OpenStreetMap)
  const searchAddress = async (text) => {
    if (text.length < 3) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5`,
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search to respect OSM fair use policy
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) searchAddress(query);
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const newCoords = [lat, lon];

    setSelectedCoords(newCoords);
    setQuery(item.display_name);
    setResults([]);

    // Send back to parent component in GeoJSON format [lng, lat]
    onLocationSelect({
      address: item.display_name,
      coords: [lon, lat],
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">
          Shop or Business Address
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Start typing your address..."
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all"
        />

        {/* Results Dropdown */}
        {results.length > 0 && (
          <div className="absolute z-[1000] w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
            {results.map((item) => (
              <button
                key={item.place_id}
                onClick={() => handleSelect(item)}
                className="w-full text-left p-4 text-xs hover:bg-blue-50 border-b border-gray-50 last:border-none transition-colors"
              >
                {item.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Map */}
      <div className="h-64 w-full rounded-2xl overflow-hidden border border-gray-100 z-0">
        <MapContainer
          center={selectedCoords}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={selectedCoords} />
          <RecenterMap coords={selectedCoords} />
        </MapContainer>
      </div>
      <p className="text-[10px] text-gray-400 text-center uppercase font-bold tracking-widest">
        Confirm your pin is in the right spot
      </p>
    </div>
  );
};

export default ArtisanLocationPicker;
