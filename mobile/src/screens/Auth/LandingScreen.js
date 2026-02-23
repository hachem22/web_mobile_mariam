import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    StatusBar,
    ImageBackground,
} from 'react-native';
import { Shield, Zap, Target, ArrowRight, Waves } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <View style={styles.featureCard}>
        <View style={[styles.featureIconContainer, { backgroundColor: color + '20' }]}>
            <Icon color={color} size={26} />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
    </View>
);

const StepItem = ({ number, title, description }) => (
    <View style={styles.stepItem}>
        <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{number}</Text>
        </View>
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{title}</Text>
            <Text style={styles.stepDesc}>{description}</Text>
        </View>
    </View>
);

const LandingScreen = ({ navigation }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 900,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 900,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulse animation for radar
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.3, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                {/* ─── HERO SECTION ─── */}
                <View style={styles.heroSection}>
                    {/* Radar decoration */}
                    <Animated.View style={[styles.radarOuter, { transform: [{ scale: pulseAnim }] }]} />
                    <Animated.View style={[styles.radarInner, { transform: [{ scale: pulseAnim }] }]} />

                    {/* Nav bar */}
                    <View style={styles.navBar}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoBox}>
                                <Text style={styles.logoLetter}>S</Text>
                            </View>
                            <Text style={styles.logoText}>SeaGuard</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.navLoginBtn}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.navLoginText}>Accéder</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Hero content */}
                    <Animated.View
                        style={[
                            styles.heroContent,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        {/* Live badge */}
                        <View style={styles.liveBadge}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveBadgeText}>SYSTÈME INTELLIGENT DE SAUVETAGE MARITIME</Text>
                        </View>

                        <Text style={styles.heroTitle}>
                            Surveiller.{'\n'}
                            <Text style={styles.heroTitleAccent}>Détecter. Sauver.</Text>
                        </Text>

                        <Text style={styles.heroSubtitle}>
                            La plateforme de surveillance par drone pilotée par IA pour une réactivité absolue en mer.
                        </Text>

                        <TouchableOpacity
                            style={styles.ctaButton}
                            onPress={() => navigation.navigate('Login')}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.ctaButtonText}>DÉPLOYER LA PLATEFORME</Text>
                            <ArrowRight color="#0A192F" size={20} />
                        </TouchableOpacity>

                        {/* Stats */}
                        <View style={styles.statsRow}>
                            {[
                                { value: '< 90s', label: 'TEMPS DE RÉPONSE' },
                                { value: '99%', label: 'DÉTECTION IA' },
                                { value: '24/7', label: 'SURVEILLANCE' },
                            ].map((stat, i) => (
                                <View key={i} style={styles.statItem}>
                                    <Text style={styles.statValue}>{stat.value}</Text>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                            ))}
                        </View>
                    </Animated.View>
                </View>

                {/* ─── FEATURES SECTION ─── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Technologie de Pointe</Text>
                    <View style={styles.sectionDivider} />

                    <View style={styles.featuresGrid}>
                        <FeatureCard
                            icon={Shield}
                            title="IA Embarquée"
                            description="Détection automatique des personnes en difficulté via la vision par ordinateur."
                            color="#00E5FF"
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Temps Réel"
                            description="Coordination fluide entre centres de commandement et équipes d'intervention."
                            color="#F6E05E"
                        />
                        <FeatureCard
                            icon={Target}
                            title="Affectation Auto"
                            description="Le nageur le plus proche et disponible est automatiquement dépêché sur zone."
                            color="#68D391"
                        />
                    </View>
                </View>

                {/* ─── HOW IT WORKS SECTION ─── */}
                <View style={[styles.section, styles.sectionDark]}>
                    <Text style={styles.sectionTitle}>Comment ça fonctionne ?</Text>
                    <View style={styles.sectionDivider} />

                    <View style={styles.stepsContainer}>
                        <StepItem
                            number="1"
                            title="Détection IA"
                            description="Le drone survole la zone en mode autonome et analyse le flux vidéo pour détecter des anomalies."
                        />
                        <View style={styles.stepConnector} />
                        <StepItem
                            number="2"
                            title="Alerte Immédiate"
                            description="Une alerte est envoyée au responsable avec les coordonnées GPS précises de la victime."
                        />
                        <View style={styles.stepConnector} />
                        <StepItem
                            number="3"
                            title="Déploiement Nageur"
                            description="Le nageur reçoit la mission sur son mobile et est guidé vers la cible en temps réel."
                        />
                    </View>
                </View>

                {/* ─── CTA BOTTOM ─── */}
                <View style={styles.ctaSection}>
                    <Waves color="rgba(0,229,255,0.1)" size={60} style={styles.wavesDecor} />
                    <Text style={styles.ctaTitle}>Prêt à sauver des vies ?</Text>
                    <Text style={styles.ctaSubtitle}>Connectez-vous à votre espace SeaGuard</Text>
                    <TouchableOpacity
                        style={styles.ctaButtonSecondary}
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.ctaButtonSecondaryText}>SE CONNECTER</Text>
                        <ArrowRight color="#00E5FF" size={18} />
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerLogo}>
                        <View style={styles.footerLogoBox}>
                            <Text style={styles.footerLogoLetter}>S</Text>
                        </View>
                        <Text style={styles.footerLogoText}>SeaGuard</Text>
                    </View>
                    <Text style={styles.footerText}>
                        © 2026 SeaGuard AI Systems.{'\n'}Technologie de surveillance maritime de nouvelle génération.
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A192F',
    },
    scrollView: {
        flex: 1,
    },

    // ─── HERO ───
    heroSection: {
        minHeight: height,
        backgroundColor: '#0A192F',
        paddingBottom: 60,
        overflow: 'hidden',
        position: 'relative',
    },
    radarOuter: {
        position: 'absolute',
        bottom: -height * 0.3,
        left: -width * 0.2,
        width: width * 1.2,
        height: width * 1.2,
        borderRadius: width * 0.6,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.06)',
        backgroundColor: 'rgba(0, 229, 255, 0.02)',
    },
    radarInner: {
        position: 'absolute',
        bottom: -height * 0.2,
        left: -width * 0.05,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.1)',
        backgroundColor: 'rgba(0, 229, 255, 0.03)',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 16,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoBox: {
        width: 36,
        height: 36,
        backgroundColor: '#00E5FF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    logoLetter: {
        color: '#0A192F',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    navLoginBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 20,
        paddingVertical: 9,
        borderRadius: 50,
    },
    navLoginText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    heroContent: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        alignItems: 'center',
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 50,
        marginBottom: 32,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00E5FF',
    },
    liveBadgeText: {
        color: '#00E5FF',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    heroTitle: {
        fontSize: 44,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: -1,
        lineHeight: 52,
        marginBottom: 20,
    },
    heroTitleAccent: {
        color: '#00E5FF',
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 40,
        maxWidth: 320,
    },
    ctaButton: {
        backgroundColor: '#00E5FF',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 32,
        paddingVertical: 18,
        borderRadius: 16,
        marginBottom: 48,
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
    },
    ctaButtonText: {
        color: '#0A192F',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 0,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 24,
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.1)',
    },
    statValue: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        color: '#00E5FF',
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        textAlign: 'center',
    },

    // ─── SECTIONS ───
    section: {
        padding: 40,
        backgroundColor: '#0A192F',
    },
    sectionDark: {
        backgroundColor: '#071120',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    sectionDivider: {
        width: 48,
        height: 3,
        backgroundColor: '#00E5FF',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 36,
    },

    // ─── FEATURES ───
    featuresGrid: {
        gap: 16,
    },
    featureCard: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    featureIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    featureTitle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    featureDesc: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 14,
        lineHeight: 22,
    },

    // ─── STEPS ───
    stepsContainer: {
        gap: 0,
    },
    stepItem: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
    },
    stepConnector: {
        width: 2,
        height: 24,
        backgroundColor: 'rgba(0,229,255,0.2)',
        marginLeft: 19,
        marginVertical: 4,
    },
    stepNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,229,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(0,229,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    stepNumberText: {
        color: '#00E5FF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    stepContent: {
        flex: 1,
        paddingTop: 8,
    },
    stepTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 6,
    },
    stepDesc: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 14,
        lineHeight: 22,
    },

    // ─── CTA SECTION ───
    ctaSection: {
        padding: 48,
        alignItems: 'center',
        backgroundColor: '#0A192F',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    wavesDecor: {
        marginBottom: 20,
        opacity: 0.3,
    },
    ctaTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    ctaSubtitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 32,
    },
    ctaButtonSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1.5,
        borderColor: '#00E5FF',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 14,
    },
    ctaButtonSecondaryText: {
        color: '#00E5FF',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    // ─── FOOTER ───
    footer: {
        backgroundColor: '#040D18',
        padding: 32,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        gap: 16,
    },
    footerLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        opacity: 0.5,
    },
    footerLogoBox: {
        width: 28,
        height: 28,
        backgroundColor: '#00E5FF',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerLogoLetter: {
        color: '#0A192F',
        fontWeight: 'bold',
        fontSize: 13,
    },
    footerLogoText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footerText: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default LandingScreen;
