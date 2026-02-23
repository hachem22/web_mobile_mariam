import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Platform
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { ChevronLeft, Radio, Battery, Signal, User } from 'lucide-react-native';
import api from '../../services/api';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.24:5000';

const DroneTrackingScreen = ({ navigation }) => {
    const [drones, setDrones] = useState([]);
    const [nageurs, setNageurs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDrones = async () => {
        try {
            const response = await api.get('/drones');
            setDrones(response.data);
        } catch (error) {
            console.error('Error fetching drones', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrones();
        const interval = setInterval(fetchDrones, 10000); // Poll every 10s

        // Listen for real-time nageur positions via socket.io
        const socket = io(SOCKET_URL, { transports: ['websocket'] });
        socket.on('nageur_position_update', (data) => {
            setNageurs(prev => {
                const existing = prev.findIndex(n => n.missionId === data.missionId);
                if (existing >= 0) {
                    const updated = [...prev];
                    updated[existing] = data;
                    return updated;
                }
                return [...prev, data];
            });
        });

        return () => {
            clearInterval(interval);
            socket.disconnect();
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Suivi Drones Live</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.mapWrapper}>
                <MapView
                    provider={PROVIDER_DEFAULT}
                    style={styles.map}
                    initialRegion={{
                        latitude: 36.8,
                        longitude: 10.3,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    customMapStyle={darkMapStyle}
                >
                    {/* Drone markers */}
                    {drones.map(drone => (
                        <Marker
                            key={drone._id}
                            coordinate={{
                                latitude: drone.position?.lat || 36.8,
                                longitude: drone.position?.lng || 10.3
                            }}
                            title={drone.nom}
                            description={`Statut: ${drone.statut}`}
                        >
                            <View style={styles.droneMarker}>
                                <Radio color="#00E5FF" size={20} />
                            </View>
                        </Marker>
                    ))}

                    {/* Nageur markers (real-time) */}
                    {nageurs.map((n, i) => (
                        <Marker
                            key={`nageur-${i}`}
                            coordinate={{
                                latitude: n.position.lat,
                                longitude: n.position.lng,
                            }}
                            title="Nageur en mission"
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <View style={styles.nageurMarker}>
                                <User color="#48BB78" size={16} />
                            </View>
                        </Marker>
                    ))}
                </MapView>

                {/* Legend */}
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#00E5FF' }]} />
                        <Text style={styles.legendText}>Drone</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#48BB78' }]} />
                        <Text style={styles.legendText}>Nageur</Text>
                    </View>
                </View>

                <View style={styles.overlay}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.droneList}>
                        {drones.map(drone => (
                            <View key={drone._id} style={styles.droneCard}>
                                <View style={styles.droneCardHeader}>
                                    <Text style={styles.droneName}>{drone.nom}</Text>
                                    <View style={[styles.statusDot, {
                                        backgroundColor: drone.statut === 'actif' ? '#48BB78' : '#F56565'
                                    }]} />
                                </View>
                                <View style={styles.droneMetrics}>
                                    <View style={styles.metric}>
                                        <Battery color="#A0AEC0" size={14} />
                                        <Text style={styles.metricText}>85%</Text>
                                    </View>
                                    <View style={styles.metric}>
                                        <Signal color="#A0AEC0" size={14} />
                                        <Text style={styles.metricText}>OK</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                        {drones.length === 0 && !loading && (
                            <View style={styles.emptyCard}>
                                <Text style={styles.emptyText}>Aucun drone actif</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
};

const darkMapStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A192F',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: '#0A192F',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    mapWrapper: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    droneMarker: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 229, 255, 0.2)',
        borderWidth: 2,
        borderColor: '#00E5FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nageurMarker: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(72, 187, 120, 0.3)',
        borderWidth: 2,
        borderColor: '#48BB78',
        alignItems: 'center',
        justifyContent: 'center',
    },
    legend: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(10, 25, 47, 0.9)',
        borderRadius: 10,
        padding: 10,
        gap: 6,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        color: '#A0AEC0',
        fontSize: 12,
    },
    overlay: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
    },
    droneList: {
        paddingHorizontal: 20,
    },
    droneCard: {
        width: 160,
        backgroundColor: 'rgba(10, 25, 47, 0.95)',
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    droneCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    droneName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    droneMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metric: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metricText: {
        color: '#A0AEC0',
        fontSize: 12,
    },
    emptyCard: {
        width: 200,
        backgroundColor: 'rgba(10, 25, 47, 0.9)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#4A5568',
        fontSize: 13,
    }
});

export default DroneTrackingScreen;
