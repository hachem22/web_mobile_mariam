import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, Polygon } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getDroneIcon = (status) => {
    const colors = {
        en_mission: '#3b82f6', // Blue
        disponible: '#22c55e', // Green
        hors_ligne: '#94a3b8', // Gray
        default: '#06b6d4'    // Cyan
    };
    const color = colors[status] || colors.default;

    return L.divIcon({
        className: 'custom-drone-icon',
        html: `
            <div style="
                background-color: ${color};
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
                box-shadow: 0 0 15px ${color}80;
                transform: rotate(-45deg);
                border-bottom-left-radius: 0;
                position: relative;
            ">
                <img src="https://cdn-icons-png.flaticon.com/512/3211/3211468.png" 
                     style="width: 24px; height: 24px; filter: brightness(0) invert(1); transform: rotate(45deg);" />
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

const MapEvents = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            if (onMapClick) onMapClick(e.latlng);
        },
    });
    return null;
};

const LiveMap = ({ drones = [], onMapClick, patrolPoints = [], theme = 'dark', zones = [] }) => {
    const tileUrl = theme === 'light'
        ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    const displayDrones = drones.length > 0 ? drones : [
        { id: 1, name: 'Drone Alpha (Offline)', lat: 43.296482, lng: 5.369780, status: 'hors_ligne' }
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
                    url={tileUrl}
                />
                <MapEvents onMapClick={onMapClick} />

                {displayDrones.map(drone => (
                    <Marker
                        key={drone.id || drone._id}
                        position={[drone.lat || drone.position_actuelle?.lat || 43.296482, drone.lng || drone.position_actuelle?.lng || 5.369780]}
                        icon={getDroneIcon(drone.statut || drone.status)}
                    >
                        <Popup className="font-dm">
                            <strong className="text-slate-900">{drone.nom || drone.name}</strong><br />
                            Status: <span className="text-sea-cyan font-bold capitalize">{drone.statut || drone.status || 'Inconnu'}</span>
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

                {zones.map((zone, idx) => (
                    <Polygon
                        key={zone._id || idx}
                        positions={zone.points.map(p => [p.lat, p.lng])}
                        pathOptions={{
                            color: '#06b6d4',
                            fillColor: '#06b6d4',
                            fillOpacity: 0.1,
                            weight: 2
                        }}
                    >
                        <Popup>
                            <div className="font-orbitron p-2">
                                <h4 className="text-sea-cyan font-bold uppercase text-[10px] mb-1">Zone de Patrouille</h4>
                                <p className="text-black text-xs">{zone.nom}</p>
                            </div>
                        </Popup>
                    </Polygon>
                ))}
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
