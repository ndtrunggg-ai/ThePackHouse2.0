// Stub for Resend API
async function sendEmailNotification(order) {
  console.log(`[Resend API] Sending email for Order ID: ${order.id} to ${order.email}`);
}

// Stub for Zalo OA API
async function sendZaloNotification(order) {
  console.log(`[Zalo OA API] Sending Zalo message for Order ID: ${order.id} to phone ${order.phone}`);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
  } else {
    res.status(200).send('Notification Middleware is running! Webhook listener is active at POST /api/webhook');
  }
}
