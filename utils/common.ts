const API_KEY_STORAGE_KEY = "api_key";

const getApiKey = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem(API_KEY_STORAGE_KEY) || null;
    }
    return null;
};

const setApiKey = (key: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(API_KEY_STORAGE_KEY, key);
    }
};

const clearAuth = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        localStorage.removeItem('userProfile');
        localStorage.removeItem('resume-storage');
        localStorage.removeItem('user-info-storage');
    }
};

export { getApiKey, setApiKey, clearAuth };
