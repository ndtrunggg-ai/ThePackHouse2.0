const express = require('express');
const bodyParser = require('body-parser');

const app = express();
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
