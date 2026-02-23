import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace this with your computer's IP address (found with ipconfig)
const API_URL = 'http://192.168.1.24:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Session expired, clearing storage...');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            // Note: Ideally, we should also update the AuthContext state here.
            // But clearing storage will force a logout on the next app reload/check.
        }
        return Promise.reject(error);
    }
);

export default api;
