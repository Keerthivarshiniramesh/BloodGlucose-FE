const API_BASE_URL = process.env.REACT_APP_BeURL;
const THINGSPEAK_URL = process.env.REACT_APP_ThinkSpeak_URL;

// Helper function for API calls with credentials
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        },
    };

    const response = await fetch(url, mergedOptions);
    const data = await response.json();
    return data;
};

// Authentication APIs
export const registerUser = async (userData) => {
    try {
        const response = await apiCall('/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        return response;
    } catch (error) {
        throw { success: false, message: 'Registration failed' };
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await apiCall('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        return response;
    } catch (error) {
        throw { success: false, message: 'Login failed' };
    }
};

export const checkAuth = async () => {
    try {
        const response = await apiCall('/checkauth', {
            method: 'GET',
        });
        return response;
    } catch (error) {
        return { success: false, user: null };
    }
};

export const logoutUser = async () => {
    try {
        const response = await apiCall('/logout', {
            method: 'GET',
        });
        return response;
    } catch (error) {
        throw { success: false, message: 'Logout failed' };
    }
};

// ThingSpeak API
export const fetchThingSpeakData = async () => {
    try {
        const response = await fetch(THINGSPEAK_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Failed to fetch ThingSpeak data');
    }
};
