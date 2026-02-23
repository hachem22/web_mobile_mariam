import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    Platform
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { MapPin, Navigation, LogOut, ChevronRight, Activity, Shield } from 'lucide-react-native';

const SwimmerDashboard = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMissions = async () => {
        try {
            const response = await api.get('/missions');
            // Filter missions assigned to this swimmer
            const myMissions = response.data.filter(
                m => m.nageur_id === user._id || m.nageur === user._id
            );
            setMissions(myMissions.length > 0 ? myMissions : response.data);
        } catch (error) {
            console.error('Error fetching missions', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMissions();
    };

    const StatusBadge = ({ status }) => {
        const getStatusColor = () => {
            switch (status) {
                case 'en cours': return '#F6E05E';
                case 'terminée': return '#48BB78';
                case 'urgente': return '#F56565';
                default: return '#A0AEC0';
            }
        };

        return (
            <View style={[styles.badge, { backgroundColor: getStatusColor() + '20', borderColor: getStatusColor() }]}>
                <Text style={[styles.badgeText, { color: getStatusColor() }]}>{status.toUpperCase()}</Text>
            </View>
        );
    };

    const renderMissionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.missionCard}
            onPress={() => navigation.navigate('MissionDetail', { mission: item })}
        >
            <View style={styles.missionHeader}>
                <View style={styles.missionInfo}>
                    <Text style={styles.missionTitle}>Mission #{item._id.slice(-4)}</Text>
                    <StatusBadge status={item.statut} />
                </View>
                <ChevronRight color="#4A5568" size={20} />
            </View>

            <View style={styles.missionDetails}>
                <View style={styles.detailItem}>
                    <MapPin color="#00E5FF" size={16} />
                    <Text style={styles.detailText}>Zone: {item.zone?.nom || 'Non spécifiée'}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Activity color="#00E5FF" size={16} />
                    <Text style={styles.detailText}>
                        Mise à jour: {new Date(item.updatedAt).toLocaleTimeString()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatarContainer}>
                        <Shield color="#00E5FF" size={20} />
                    </View>
                    <View>
                        <Text style={styles.welcome}>Bonjour,</Text>
                        <Text style={styles.userName}>{user?.nom} {user?.prenom}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <LogOut color="#F56565" size={22} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Missions assignées</Text>
                    <Navigation color="#00E5FF" size={20} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#00E5FF" style={styles.loader} />
                ) : (
                    <FlatList
                        data={missions}
                        renderItem={renderMissionItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.list}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E5FF" />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyIcon}>🌊</Text>
                                <Text style={styles.emptyTitle}>Aucune mission active</Text>
                                <Text style={styles.emptyText}>Vous serez notifié lors de l'assignation d'une mission.</Text>
                            </View>
                        }
                    />
                )}
            </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingTop: Platform.OS === 'android' ? 48 : 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcome: {
        color: '#A0AEC0',
        fontSize: 13,
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(245, 101, 101, 0.1)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    list: {
        paddingBottom: 24,
    },
    missionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    missionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    missionInfo: {
        flex: 1,
    },
    missionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    missionDetails: {
        gap: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        color: '#A0AEC0',
        fontSize: 14,
    },
    loader: {
        marginTop: 48,
    },
    emptyContainer: {
        padding: 48,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptyText: {
        color: '#718096',
        textAlign: 'center',
        lineHeight: 22,
    }
});

export default SwimmerDashboard;
