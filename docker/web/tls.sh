#!/bin/sh
# Turns on HTTPS when a certificate is mounted in /etc/nginx/certs, such as a Cloudflare Origin Certificate.
if [ -f /etc/nginx/certs/origin.pem ] && [ -f /etc/nginx/certs/origin.key ]; then
  cat > /etc/nginx/tls.inc <<'EOF'
listen 443 ssl;
http2 on;
ssl_certificate /etc/nginx/certs/origin.pem;
ssl_certificate_key /etc/nginx/certs/origin.key;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_session_cache shared:tls:1m;
EOF
fi
