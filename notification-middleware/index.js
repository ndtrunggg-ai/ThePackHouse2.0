const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

// Proxy requests to Strapi Cloud to bypass CORS for the Admin Panel
app.use('/proxy', createProxyMiddleware({ 
  target: 'https://whimsical-renewal-84c9832818.strapiapp.com', 
  changeOrigin: true,
  pathRewrite: { '^/proxy': '' }
}));

app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

// Stub for Resend API
async function sendEmailNotification(order) {
  console.log(`[Resend API] Sending email for Order ID: ${order.id} to ${order.email}`);
  // Implementation would use Resend Node.js SDK
  // const resend = new Resend('re_123456789');
  // await resend.emails.send({ ... });
}

// Stub for Zalo OA API
async function sendZaloNotification(order) {
  console.log(`[Zalo OA API] Sending Zalo message for Order ID: ${order.id} to phone ${order.phone}`);
  // Implementation would call Zalo OA API
}

app.get('/', (req, res) => {
  res.send('Notification Middleware is running! Webhook listener is active at POST /webhook');
});

app.post('/webhook', async (req, res) => {
  const payload = req.body;
  
  if (!payload || !payload.event) {
    return res.status(400).send('Invalid webhook payload');
  }

  console.log(`Received webhook event: ${payload.event}`);

  // We are interested in order creation
  if (payload.event === 'entry.create' && payload.model === 'order') {
    const order = payload.entry;
    console.log(`New order created: ${order.customerName} - Total: ${order.total}`);
    
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

  res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
  console.log(`Notification middleware listening on port ${PORT}`);
});
