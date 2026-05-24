// Configuration for The Pack House Frontend
window.ENV = {
  // Use proxy to completely avoid CORS errors on both local and Vercel environments
  API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:4000/proxy' 
    : '/proxy'
};
