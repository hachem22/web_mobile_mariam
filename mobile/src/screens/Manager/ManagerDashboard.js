import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Shield, Zap, Info, LogOut, Radio } from 'lucide-react-native';

const ManagerDashboard = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({ drones: 0, missions: 0, alerts: 0 });
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [dronesRes, missionsRes, alertsRes] = await Promise.all([
                api.get('/drones'),
                api.get('/missions'),
                api.get('/missions/alertes')
            ]);

            setStats({
                drones: dronesRes.data.length,
                missions: missionsRes.data.filter(m => m.statut === 'en cours').length,
                alerts: alertsRes.data.length
            });
            setAlerts(alertsRes.data.slice(0, 10)); // Top 10 recent alerts
        } catch (error) {
            console.error('Error fetching manager data', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const StatCard = ({ title, value, icon: Icon, color, onPress }) => (
        <TouchableOpacity style={styles.statCard} onPress={onPress} disabled={!onPress}>
            <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
                <Icon color={color} size={24} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoRow}>
                    <Shield color="#00E5FF" size={28} />
                    <Text style={styles.headerTitle}>SeaGuard Control</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <LogOut color="#F56565" size={22} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E5FF" />
                }
            >
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>Tableau de bord</Text>
                    <Text style={styles.managerName}>Manager: {user.nom}</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#00E5FF" style={{ marginTop: 40 }} />
                ) : (
                    <>
                        <View style={styles.statsGrid}>
                            <StatCard
                                title="Drones"
                                value={stats.drones}
                                icon={Radio}
                                color="#00E5FF"
                                onPress={() => navigation.navigate('DroneTracking')}
                            />
                            <StatCard
                                title="En Cours"
                                value={stats.missions}
                                icon={Zap}
                                color="#F6E05E"
                            />
                            <StatCard
                                title="Alertes"
                                value={stats.alerts}
                                icon={Info}
                                color="#F56565"
                            />
                        </View>

                        <Text style={styles.sectionTitle}>Alertes Récentes</Text>

                        <View style={styles.alertList}>
                            {alerts.length > 0 ? alerts.map((alert, index) => (
                                <View key={alert._id || index} style={styles.alertCard}>
                                    <View style={styles.alertHeader}>
                                        <View style={styles.alertTypeTag}>
                                            <Text style={styles.alertTypeText}>SOS</Text>
                                        </View>
                                        <Text style={styles.alertTime}>{new Date(alert.createdAt).toLocaleTimeString()}</Text>
                                    </View>
                                    <Text style={styles.alertDesc}>{alert.message || 'Détection suspecte dans la zone'}</Text>
                                    <Text style={styles.alertZone}>Zone: {alert.zone?.nom || 'Perimètre 1'}</Text>
                                </View>
                            )) : (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Aucune alerte récente.</Text>
                                </View>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    logoutButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    welcomeSection: {
        marginBottom: 32,
    },
    welcomeText: {
        color: '#A0AEC0',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    managerName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 40,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    statTitle: {
        color: '#718096',
        fontSize: 12,
        marginTop: 4,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    alertList: {
        gap: 12,
        paddingBottom: 40,
    },
    alertCard: {
        backgroundColor: 'rgba(245, 101, 101, 0.05)',
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#F56565',
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    alertTypeTag: {
        backgroundColor: '#F56565',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    alertTypeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    alertTime: {
        color: '#718096',
        fontSize: 12,
    },
    alertDesc: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 4,
    },
    alertZone: {
        color: '#718096',
        fontSize: 13,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#4A5568',
    }
});

export default ManagerDashboard;
