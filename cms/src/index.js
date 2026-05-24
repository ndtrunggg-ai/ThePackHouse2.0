'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      // 1. Enable public permission for creating an order
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
      if (publicRole) {
        const action = 'api::order.order.create';
        const existingPermission = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: { action, role: publicRole.id }
        });
        if (!existingPermission) {
          await strapi.db.query('plugin::users-permissions.permission').create({
            data: { action, role: publicRole.id }
          });
          console.log(`Granted public permission to create orders`);
        }
      }
      
      // 2. Add the webhook if it doesn't exist
      const webhookStore = strapi.get('webhookStore');
      if (webhookStore) {
        const webhooks = await webhookStore.findWebhooks();
        const webhookUrl = 'http://localhost:4000/webhook';
        const existingWebhook = webhooks.find(w => w.url === webhookUrl);
        if (!existingWebhook) {
          await webhookStore.createWebhook({
            name: 'Notification Middleware',
            url: webhookUrl,
            events: ['entry.create'],
            isEnabled: true,
            headers: {}
          });
          console.log(`Created webhook pointing to ${webhookUrl}`);
        }
      }
    } catch (err) {
      console.error('Error in bootstrap:', err.message);
    }
  },
};
