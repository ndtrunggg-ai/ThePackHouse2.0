const http = require('node:http');

const PORT = process.env.PORT || 4000;
const BODY_LIMIT = 1024 * 1024;

// Stub for Resend API
async function sendEmailNotification(order) {
  console.log(`[Resend API] Sending email for Order ID: ${order.id}`);
  // Implementation would use Resend Node.js SDK
  // const resend = new Resend('re_123456789');
  // await resend.emails.send({ ... });
}

// Stub for Zalo OA API
async function sendZaloNotification(order) {
  console.log(`[Zalo OA API] Sending Zalo message for Order ID: ${order.id}`);
  // Implementation would call Zalo OA API
}

async function handleWebhook(payload) {
  console.log(`Received webhook event: ${payload.event}`);

  // We are interested in order creation
  if (payload.event === 'entry.create' && payload.model === 'order') {
    const order = payload.entry;
    console.log(`New order created: ${order.id} - Total: ${order.total}`);

    try {
      await Promise.all([
        sendEmailNotification(order),
        sendZaloNotification(order)
      ]);
      console.log('Notifications sent successfully.');
    } catch (err) {
      console.error('Error sending notifications:', err);
    }
  }
}

const server = http.createServer((req, res) => {
  const reply = (status, message) => {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(message);
  };

  if (req.method === 'GET' && req.url === '/') {
    return reply(200, 'Notification Middleware is running! Webhook listener is active at POST /webhook');
  }
  if (req.method !== 'POST' || req.url !== '/webhook') {
    return reply(404, 'Not found');
  }

  const chunks = [];
  let size = 0;
  req.on('data', (chunk) => {
    size += chunk.length;
    if (size <= BODY_LIMIT) chunks.push(chunk);
  });
  req.on('end', async () => {
    let payload;
    try {
      payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch (err) {
      payload = null;
    }
    if (!payload || !payload.event) {
      return reply(400, 'Invalid webhook payload');
    }
    await handleWebhook(payload);
    reply(200, 'Webhook received');
  });
});

server.listen(PORT, () => {
  console.log(`Notification middleware listening on port ${PORT}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
