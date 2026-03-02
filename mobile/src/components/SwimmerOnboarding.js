import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Shield, AlertTriangle, Navigation, ChevronRight, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const STEPS = [
    {
        icon: <Shield color="#00E5FF" size={48} />,
        title: "Bienvenue sur SeaGuard",
        description: "Ce tableau de bord est votre centre de commandement. Il vous connecte au Responsable Plage et aux drones d'assistance en temps réel."
    },
    {
        icon: <Navigation color="#00E5FF" size={48} />,
        title: "Assistance et Missions",
        description: "Lorsqu'une mission vous est assignée, une alarme retentit et l'écran clignote en rouge. La mission apparaîtra immédiatement en tête de liste pour une intervention rapide."
    },
    {
        icon: <AlertTriangle color="#F56565" size={48} />,
        title: "Déclarer une Urgence",
        description: "Si vous repérez une personne en danger, appuyez sur le bouton SOS rouge. Le drone de la zone se déploiera automatiquement sur vos coordonnées géographiques."
    }
];

const SwimmerOnboarding = ({ visible, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
            setCurrentStep(0); // Reset for next time
        }
    };

    if (!visible) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        {STEPS[currentStep].icon}
                    </View>

                    <View style={styles.pagination}>
                        {STEPS.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentStep && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>

                    <Text style={styles.title}>{STEPS[currentStep].title}</Text>
                    <Text style={styles.description}>{STEPS[currentStep].description}</Text>

                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextText}>
                            {currentStep === STEPS.length - 1 ? "J'ai compris !" : "Suivant"}
                        </Text>
                        {currentStep === STEPS.length - 1 ? (
                            <Check color="#fff" size={20} />
                        ) : (
                            <ChevronRight color="#fff" size={20} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(10, 25, 47, 0.9)', // Sea-dark but semi-transparent
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: '#112240', // Slightly lighter sea-dark
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: width - 48,
        borderWidth: 1,
        borderColor: 'rgba(0, 229, 255, 0.2)', // Sea-cyan border
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 10,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: 'rgba(0, 229, 255, 0.2)',
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    activeDot: {
        backgroundColor: '#00E5FF',
        width: 24,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        color: '#A0AEC0',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00E5FF',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: '100%',
        gap: 8,
    },
    nextText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default SwimmerOnboarding;
