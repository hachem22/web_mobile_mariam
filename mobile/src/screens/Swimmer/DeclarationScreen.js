import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { ChevronLeft, AlertTriangle } from 'lucide-react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import api from '../../services/api';

const DeclarationScreen = ({ navigation }) => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [mapRegion, setMapRegion] = useState(null);
    const [markerCoordinate, setMarkerCoordinate] = useState(null);

    // Get initial location on mount
    React.useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            try {
                let location = await Location.getCurrentPositionAsync({});
                const coords = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                };
                setMapRegion(coords);
                setMarkerCoordinate({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });
            } catch (error) {
                console.error('Error fetching location on mount:', error);
            }
        })();
    }, []);

    const handleSubmit = async () => {
        if (!description.trim()) {
            Alert.alert('Erreur', 'Veuillez décrire la situation d\'urgence.');
            return;
        }

        if (!markerCoordinate) {
            Alert.alert('Erreur', 'Position inconnue. Assurez-vous d\'avoir autorisé la localisation.');
            return;
        }

        setLoading(true);
        try {
            // Envoyer la déclaration avec la position du marqueur
            await api.post('/declarations', {
                description: description,
                position: {
                    lat: markerCoordinate.latitude,
                    lng: markerCoordinate.longitude
                }
            });

            Alert.alert(
                'Urgence signalée',
                'Votre déclaration a été envoyée au centre de commandement.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );

        } catch (error) {
            console.error('Erreur lors de la déclaration:', error);
            Alert.alert('Erreur', 'Impossible d\'envoyer la déclaration. Veuillez réessayer.');
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
                <Text style={styles.headerTitle}>Déclarer une Urgence</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.warningCard}>
                    <AlertTriangle color="#F56565" size={32} style={{ marginBottom: 12 }} />
                    <Text style={styles.warningTitle}>Alerte Personne Perdue</Text>
                    <Text style={styles.warningText}>
                        Décrivez la situation et ajustez la position sur la carte si nécessaire.
                    </Text>
                </View>

                {mapRegion ? (
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={mapRegion}
                        >
                            <Marker
                                coordinate={markerCoordinate}
                                draggable
                                onDragEnd={(e) => setMarkerCoordinate(e.nativeEvent.coordinate)}
                                title="Position de l'urgence"
                                description="Maintenez et glissez pour ajuster"
                            >
                                <View style={styles.customMarker}>
                                    <AlertTriangle color="#fff" size={24} />
                                </View>
                            </Marker>
                        </MapView>
                        <Text style={styles.mapHintText}>Vous pouvez déplacer le marqueur rouge pour ajuster la position.</Text>
                    </View>
                ) : (
                    <View style={styles.mapLoadingContainer}>
                        <ActivityIndicator color="#F56565" size="large" />
                        <Text style={styles.mapHintText}>Recherche de votre position GPS...</Text>
                    </View>
                )}

                <Text style={styles.label}>Description de la situation</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Ex: Personne en difficulté à 50m au large, gilet de sauvetage rouge..."
                    placeholderTextColor="#4A5568"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                />

                <TouchableOpacity
                    style={[styles.submitButton, (loading || !description.trim()) && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading || !description.trim()}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>ENVOYER L'ALERTE</Text>
                    )}
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

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
        paddingTop: Platform.OS === 'android' ? 24 : 0,
        height: Platform.OS === 'android' ? 80 : 56,
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
        padding: 24,
    },
    warningCard: {
        backgroundColor: 'rgba(245, 101, 101, 0.1)',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(245, 101, 101, 0.3)',
        marginBottom: 20,
        alignItems: 'center',
    },
    warningTitle: {
        color: '#F56565',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    warningText: {
        color: '#FFA8A8',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 22,
    },
    label: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 12,
    },
    mapContainer: {
        height: 200,
        marginBottom: 24,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(245, 101, 101, 0.3)',
    },
    mapLoadingContainer: {
        height: 200,
        marginBottom: 24,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    map: {
        flex: 1,
    },
    mapHintText: {
        color: '#FFA8A8',
        fontSize: 12,
        textAlign: 'center',
        padding: 8,
        backgroundColor: 'rgba(245, 101, 101, 0.1)',
    },
    customMarker: {
        backgroundColor: '#F56565',
        padding: 5,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        padding: 16,
        fontSize: 15,
        minHeight: 120,
        marginBottom: 32,
    },
    submitButton: {
        backgroundColor: '#F56565',
        height: 56,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#F56565',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitButtonDisabled: {
        backgroundColor: '#2D3748',
        shadowOpacity: 0,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});

export default DeclarationScreen;
