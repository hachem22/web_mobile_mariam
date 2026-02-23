import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Platform
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ChevronLeft, Radio, Battery, Signal } from 'lucide-react-native';
import api from '../../services/api';

const DroneTrackingScreen = ({ navigation }) => {
    const [drones, setDrones] = useState([]);
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
        const interval = setInterval(fetchDrones, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const DroneMarker = ({ drone }) => (
        <Marker
            coordinate={{
                latitude: drone.position?.lat || 36.8,
                longitude: drone.position?.lng || 10.3
            }}
            title={drone.nom}
            description={`Status: ${drone.statut}`}
        >
            <View style={styles.droneMarker}>
                <Radio color="#00E5FF" size={20} />
            </View>
        </Marker>
    );

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
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: 36.8,
                        longitude: 10.3,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    customMapStyle={darkMapStyle}
                >
                    {drones.map(drone => (
                        <DroneMarker key={drone._id} drone={drone} />
                    ))}
                </MapView>

                <View style={styles.overlay}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.droneList}>
                        {drones.map(drone => (
                            <View key={drone._id} style={styles.droneCard}>
                                <View style={styles.droneCardHeader}>
                                    <Text style={styles.droneName}>{drone.nom}</Text>
                                    <View style={[styles.statusDot, { backgroundColor: drone.statut === 'actif' ? '#48BB78' : '#F56565' }]} />
                                </View>
                                <View style={styles.droneMetrics}>
                                    <View style={styles.metric}>
                                        <Battery color="#A0AEC0" size={14} />
                                        <Text style={styles.metricText}>85%</Text>
                                    </View>
                                    <View style={styles.metric}>
                                        <Signal color="#A0AEC0" size={14} />
                                        <Text style={styles.metricText}>Good</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
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
        backdropBlur: 10,
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
    }
});

import { ScrollView } from 'react-native-gesture-handler';
export default DroneTrackingScreen;
