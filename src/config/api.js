// ===================================================================
// Extrain Web Frontend - API Configuration
// সব API URL এখান থেকে export হবে
// ===================================================================

const PRODUCTION_API = 'https://extrain-web-server.vercel.app/api';
const LOCAL_API = 'http://localhost:5000/api';

// Use production URL by default, localhost only in development
export const API_BASE_URL =
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
        ? LOCAL_API
        : PRODUCTION_API;
