const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token") || null;
    }
    return null;
};

const parseJwt = (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const decoded = decodeURIComponent(atob(payload).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(decoded);
    } catch (e) {
        return null;
    }
};

const isTokenExpired = (token: string | null) => {
    if (!token) return true;
    const payload: any = parseJwt(token as string);
    if (!payload || !payload.exp) return true;
    // exp is in seconds
    return Date.now() > payload.exp * 1000;
};

const getValidToken = () => {
    const t = getToken();
    if (!t) return null;
    return isTokenExpired(t) ? null : t;
};

const clearAuth = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('resume-storage');
    }
};

export { getToken, parseJwt, isTokenExpired, getValidToken, clearAuth };