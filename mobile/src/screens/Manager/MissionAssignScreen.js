import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    Platform
} from 'react-native';
import { ChevronLeft, User, MapPin, Send } from 'lucide-react-native';
import api from '../../services/api';

const MissionAssignScreen = ({ navigation }) => {
    const [nageurs, setNageurs] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedNageur, setSelectedNageur] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, zonesRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/zones').catch(() => ({ data: [] })),
                ]);
                const swimmers = usersRes.data.filter(u => u.role === 'nageur');
                setNageurs(swimmers);
                setZones(zonesRes.data);
            } catch (error) {
                console.error('Error fetching data', error);
                Alert.alert('Erreur', 'Impossible de charger les nageurs.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (!selectedNageur) {
            Alert.alert('Erreur', 'Veuillez sélectionner un nageur.');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/missions', {
                nageur_id: selectedNageur._id,
                zone_id: selectedZone?._id,
                description: description || 'Mission d\'intervention',
                statut: 'en cours',
            });
            Alert.alert('Succès', `Mission assignée à ${selectedNageur.nom} avec succès !`, [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Error creating mission', error);
            Alert.alert('Erreur', 'Impossible de créer la mission. Veuillez réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Assigner une Mission</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#00E5FF" style={{ marginTop: 60 }} />
            ) : (
                <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">

                    {/* Nageur Selection */}
                    <Text style={styles.sectionLabel}>
                        <User color="#00E5FF" size={14} /> Sélectionner un nageur
                    </Text>
                    <View style={styles.selectionGrid}>
                        {nageurs.map(nageur => (
                            <TouchableOpacity
                                key={nageur._id}
                                style={[
                                    styles.selectionCard,
                                    selectedNageur?._id === nageur._id && styles.selectionCardActive
                                ]}
                                onPress={() => setSelectedNageur(nageur)}
                            >
                                <View style={[
                                    styles.avatarSmall,
                                    selectedNageur?._id === nageur._id && { backgroundColor: 'rgba(0, 229, 255, 0.25)' }
                                ]}>
                                    <User
                                        color={selectedNageur?._id === nageur._id ? '#00E5FF' : '#718096'}
                                        size={18}
                                    />
                                </View>
                                <Text style={[
                                    styles.selectionName,
                                    selectedNageur?._id === nageur._id && styles.selectionNameActive
                                ]}>
                                    {nageur.nom} {nageur.prenom}
                                </Text>
                                {selectedNageur?._id === nageur._id && (
                                    <View style={styles.activeIndicator} />
                                )}
                            </TouchableOpacity>
                        ))}
                        {nageurs.length === 0 && (
                            <Text style={styles.emptyText}>Aucun nageur disponible.</Text>
                        )}
                    </View>

                    {/* Zone Selection */}
                    {zones.length > 0 && (
                        <>
                            <Text style={styles.sectionLabel}>
                                <MapPin color="#00E5FF" size={14} /> Zone d'intervention (optionnel)
                            </Text>
                            <View style={styles.selectionGrid}>
                                {zones.map(zone => (
                                    <TouchableOpacity
                                        key={zone._id}
                                        style={[
                                            styles.selectionCard,
                                            selectedZone?._id === zone._id && styles.selectionCardActive
                                        ]}
                                        onPress={() => setSelectedZone(
                                            selectedZone?._id === zone._id ? null : zone
                                        )}
                                    >
                                        <Text style={[
                                            styles.selectionName,
                                            selectedZone?._id === zone._id && styles.selectionNameActive
                                        ]}>
                                            {zone.nom}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}

                    {/* Description */}
                    <Text style={styles.sectionLabel}>Description (optionnel)</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Détails de la mission..."
                        placeholderTextColor="#4A5568"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    {/* Submit */}
                    <TouchableOpacity
                        style={[styles.submitButton, (!selectedNageur || submitting) && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={!selectedNageur || submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#0A192F" />
                        ) : (
                            <>
                                <Send color="#0A192F" size={20} />
                                <Text style={styles.submitButtonText}>ASSIGNER LA MISSION</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            )}
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
        padding: 24,
    },
    sectionLabel: {
        color: '#A0AEC0',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginTop: 24,
    },
    selectionGrid: {
        gap: 10,
    },
    selectionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 12,
    },
    selectionCardActive: {
        borderColor: '#00E5FF',
        backgroundColor: 'rgba(0, 229, 255, 0.08)',
    },
    avatarSmall: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.07)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectionName: {
        color: '#A0AEC0',
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
    selectionNameActive: {
        color: '#fff',
    },
    activeIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00E5FF',
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
        padding: 16,
        fontSize: 15,
        minHeight: 100,
    },
    submitButton: {
        backgroundColor: '#00E5FF',
        height: 56,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 32,
        marginBottom: 40,
        shadowColor: '#00E5FF',
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
        color: '#0A192F',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    emptyText: {
        color: '#4A5568',
        textAlign: 'center',
        padding: 20,
    }
});

export default MissionAssignScreen;
