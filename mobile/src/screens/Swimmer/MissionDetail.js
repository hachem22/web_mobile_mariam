import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Video, ResizeMode } from 'expo-av';
import { ChevronLeft, MapPin, Navigation, CheckCircle, Clock, Camera, User } from 'lucide-react-native';
import api from '../../services/api';

const MissionDetail = ({ route, navigation }) => {
    const { mission } = route.params;
    const [statut, setStatut] = useState(mission.statut);
    const [loading, setLoading] = useState(false);
    const [swimmerPos, setSwimmerPos] = useState(null);

    // Support both formats (legacy and new)
    const victimLocation = mission.victime_position ? {
        latitude: mission.victime_position.lat,
        longitude: mission.victime_position.lng
    } : (mission.location || {
        latitude: 36.8,
        longitude: 10.1
    });

    useEffect(() => {
        let subscription;
        const startTracking = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission refusée', 'La localisation est nécessaire pour suivre votre progression.');
                return;
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 5, // Update every 5 meters
                },
                (location) => {
                    setSwimmerPos({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    });
                }
            );
        };

        startTracking();
        return () => subscription?.remove();
    }, []);

    const updateStatus = async (newStatus) => {
        setLoading(true);
        try {
            await api.put(`/missions/${mission._id}`, { statut: newStatus });
            setStatut(newStatus);
            Alert.alert('Succès', `Statut mis à jour: ${newStatus}`);
        } catch (error) {
            console.error('Error updating mission status', error);
            Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Détails de la Mission</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.mapContainer}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{
                            latitude: (victimLocation.latitude + (swimmerPos?.latitude || victimLocation.latitude)) / 2,
                            longitude: (victimLocation.longitude + (swimmerPos?.longitude || victimLocation.longitude)) / 2,
                            latitudeDelta: Math.abs(victimLocation.latitude - (swimmerPos?.latitude || victimLocation.latitude)) * 2 || 0.01,
                            longitudeDelta: Math.abs(victimLocation.longitude - (swimmerPos?.longitude || victimLocation.longitude)) * 2 || 0.01,
                        }}
                        customMapStyle={darkMapStyle}
                    >
                        {/* Victim Marker */}
                        <Marker
                            coordinate={victimLocation}
                            title="Position de la victime"
                            description="Intervention requise"
                        >
                            <View style={styles.markerContainer}>
                                <View style={styles.markerOutline}>
                                    <View style={styles.markerDot} />
                                </View>
                            </View>
                        </Marker>

                        {/* Swimmer Marker */}
                        {swimmerPos && (
                            <Marker
                                coordinate={swimmerPos}
                                title="Vous"
                                anchor={{ x: 0.5, y: 0.5 }}
                            >
                                <View style={styles.swimmerMarker}>
                                    <User color="#00E5FF" size={20} />
                                </View>
                            </Marker>
                        )}

                        {/* Connection Line */}
                        {swimmerPos && (
                            <Polyline
                                coordinates={[swimmerPos, victimLocation]}
                                strokeColor="#00E5FF"
                                strokeWidth={2}
                                lineDashPattern={[5, 5]}
                            />
                        )}
                    </MapView>
                </View>

                <View style={styles.videoSection}>
                    <View style={styles.sectionHeader}>
                        <Camera color="#00E5FF" size={16} />
                        <Text style={styles.sectionTitle}>Flux Drone Direct</Text>
                    </View>
                    <View style={styles.videoCard}>
                        <Video
                            style={styles.video}
                            source={{
                                uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                            }}
                            useNativeControls={false}
                            resizeMode={ResizeMode.COVER}
                            isLooping
                            shouldPlay
                            isMuted
                        />
                        <View style={styles.videoOverlay}>
                            <View style={styles.recDot} />
                            <Text style={styles.videoText}>LIVE - DRONE ALPHA</Text>
                        </View>
                    </div>
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.titleRow}>
                        <Text style={styles.missionId}>MISSION #{mission._id.slice(-6)}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statut === 'terminée' ? '#48BB7820' : '#F6E05E20', borderColor: statut === 'terminée' ? '#48BB78' : '#F6E05E' }]}>
                            <Text style={[styles.statusText, { color: statut === 'terminée' ? '#48BB78' : '#F6E05E' }]}>{statut.toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={styles.detailCard}>
                        <View style={styles.detailRow}>
                            <MapPin color="#00E5FF" size={20} />
                            <View>
                                <Text style={styles.detailLabel}>Localisation</Text>
                                <Text style={styles.detailValue}>{mission.zone?.nom || 'Sidi Bou Said Zone A'}</Text>
                            </View>
                        </View>
                        <View style={styles.detailRow}>
                            <Clock color="#00E5FF" size={20} />
                            <View>
                                <Text style={styles.detailLabel}>Assignée le</Text>
                                <Text style={styles.detailValue}>{new Date(mission.createdAt).toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Actions</Text>

                    <View style={styles.actionsContainer}>
                        {statut !== 'terminée' && (
                            <>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.primaryButton]}
                                    onPress={() => updateStatus('terminée')}
                                    disabled={loading}
                                >
                                    <CheckCircle color="#fff" size={20} />
                                    <Text style={styles.actionButtonText}>TERMINER LA MISSION</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.secondaryButton]}
                                    onPress={() => {
                                        // Open external maps app
                                        Alert.alert('Navigation', 'Démarrage du guidage GPS...');
                                    }}
                                >
                                    <Navigation color="#00E5FF" size={20} />
                                    <Text style={[styles.actionButtonText, { color: '#00E5FF' }]}>S'Y RENDRE (GPS)</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {statut === 'terminée' && (
                            <View style={styles.completedState}>
                                <CheckCircle color="#48BB78" size={32} />
                                <Text style={styles.completedText}>Mission accomplie avec succès</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
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
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    mapContainer: {
        height: 300,
        width: '100%',
        backgroundColor: '#1A202C',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    infoSection: {
        padding: 24,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    missionId: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    detailCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    detailLabel: {
        color: '#718096',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    detailValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        letterSpacing: 1,
    },
    actionsContainer: {
        gap: 12,
    },
    actionButton: {
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#00E5FF',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#00E5FF',
    },
    videoSection: {
        padding: 24,
        paddingTop: 0,
    },
    videoCard: {
        height: 180,
        backgroundColor: '#000',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    video: {
        flex: 1,
    },
    videoOverlay: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 6,
    },
    recDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#F56565',
    },
    videoText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    swimmerMarker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 229, 255, 0.2)',
        borderWidth: 2,
        borderColor: '#00E5FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerOutline: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(245, 101, 101, 0.3)',
        borderWidth: 2,
        borderColor: '#F56565',
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F56565',
    },
    completedState: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'rgba(72, 187, 120, 0.1)',
        borderRadius: 16,
    },
    completedText: {
        color: '#48BB78',
        fontWeight: 'bold',
        marginTop: 12,
    }
});

export default MissionDetail;
