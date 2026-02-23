import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

import LandingScreen from '../screens/Auth/LandingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SwimmerDashboard from '../screens/Swimmer/SwimmerDashboard';
import ManagerDashboard from '../screens/Manager/ManagerDashboard';
import DroneTrackingScreen from '../screens/Manager/DroneTrackingScreen';
import MissionAssignScreen from '../screens/Manager/MissionAssignScreen';
import MissionDetail from '../screens/Swimmer/MissionDetail';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                <>
                    <Stack.Screen name="Landing" component={LandingScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                </>
            ) : user.role === 'nageur' ? (
                <>
                    <Stack.Screen name="SwimmerDash" component={SwimmerDashboard} />
                    <Stack.Screen name="MissionDetail" component={MissionDetail} />
                </>
            ) : (
                <>
                    <Stack.Screen name="ManagerDash" component={ManagerDashboard} />
                    <Stack.Screen name="DroneTracking" component={DroneTrackingScreen} />
                    <Stack.Screen name="MissionAssign" component={MissionAssignScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
