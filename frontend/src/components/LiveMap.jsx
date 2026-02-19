import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const droneIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3211/3211468.png', // Drone icon
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

const MapEvents = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            if (onMapClick) onMapClick(e.latlng);
        },
    });
    return null;
};

const LiveMap = ({ drones = [], onMapClick, patrolPoints = [] }) => {
    const displayDrones = drones.length > 0 ? drones : [
        { id: 1, name: 'Drone Alpha (Offline)', lat: 43.296482, lng: 5.369780, status: 'Déconnecté' }
    ];

    return (
        <div className="h-full w-full rounded-xl overflow-hidden shadow-2xl border border-white/5 relative">
            <MapContainer
                center={[43.296482, 5.369780]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapEvents onMapClick={onMapClick} />

                {displayDrones.map(drone => (
                    <Marker key={drone.id || drone._id} position={[drone.lat || drone.position_actuelle?.lat || 43.296482, drone.lng || drone.position_actuelle?.lng || 5.369780]} icon={droneIcon}>
                        <Popup className="font-dm">
                            <strong className="text-slate-900">{drone.nom || drone.name}</strong><br />
                            Status: <span className="text-sea-cyan">{drone.statut || drone.status}</span>
                        </Popup>
                    </Marker>
                ))}

                {patrolPoints.map((point, idx) => (
                    <Marker key={idx} position={point}>
                        <Popup>Point {idx + 1}</Popup>
                    </Marker>
                ))}

                {patrolPoints.length > 1 && (
                    <Polyline
                        positions={[...patrolPoints, patrolPoints.length === 4 ? patrolPoints[0] : null].filter(Boolean)}
                        color="#00D4FF"
                        dashArray="5, 10"
                    />
                )}
            </MapContainer>

            {/* Overlay Status */}
            <div className="absolute top-4 right-4 bg-sea-dark/80 backdrop-blur-md p-3 rounded-lg border border-sea-light/10 z-[1000]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-sea-light">LIVE DATA</span>
                </div>
            </div>
        </div>
    );
};

export default LiveMap;
