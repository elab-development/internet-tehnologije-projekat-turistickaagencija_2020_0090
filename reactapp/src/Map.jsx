// Maro, ovo je Leaflet mapa koja pokazuje destinacije iz aranžmana.
// Zašto: vizuelno potvrđujemo gde se putuje i koristimo koordinate iz baze.
// Ako zapne: proveri da li su `latitude` i `longitude` prosleđeni i da li je Leaflet CSS importovan u `app.css`.
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import iconMark from './assets/icon-mark.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl: iconMark,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: markerShadow,
    shadowSize: [41, 41]
});

const FALLBACK_CENTER = [45.2671, 19.8335];

const Map = ({ arrangements, center, zoom = 6 }) => {
    const mapCenter = center || FALLBACK_CENTER;

    return (
        <MapContainer 
            center={mapCenter}
            zoom={zoom}
            style={{ height: '100%', width: '100%', minHeight: '300px' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {(arrangements || []).map(arrangement => {
                const latitude = Number(arrangement?.destination?.latitude);
                const longitude = Number(arrangement?.destination?.longitude);
                const hasValidCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
                const markerPosition = hasValidCoordinates ? [latitude, longitude] : FALLBACK_CENTER;

                return (
                    <Marker
                        key={arrangement.id}
                        position={markerPosition}
                        icon={customIcon}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-semibold">{arrangement.name}</h3>
                                <p className="text-sm text-gray-600">{arrangement.description}</p>
                                <p className="text-lg font-bold text-blue-600 mt-2">
                                    {arrangement.price} €
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default Map; 