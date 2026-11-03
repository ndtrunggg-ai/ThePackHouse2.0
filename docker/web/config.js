// Configuration for the Docker stack: nginx proxies the CMS on the same origin
window.ENV = {
  API_URL: window.location.origin
};
