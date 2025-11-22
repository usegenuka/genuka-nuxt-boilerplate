/**
 * Webhook Endpoint
 * Receives and processes webhook events from Genuka
 *
 * Expected payload:
 * {
 *   type: string,        // Event type (e.g., 'company.updated', 'order.created')
 *   data: any,           // Event data
 *   timestamp: string,   // Event timestamp
 *   company_id: string   // Company ID
 * }
 */

import type { WebhookEvent } from '~/types/company';
import { WEBHOOK_EVENTS } from '~/config/constants';

export default defineEventHandler(async (event) => {
  try {
    // Parse webhook payload
    const body = await readBody<WebhookEvent>(event);

    // Validate payload
    if (!body || !body.type || !body.company_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid webhook payload: type and company_id are required',
      });
    }

    // Log webhook event (without sensitive data)
    console.log('Webhook received:', {
      type: body.type,
      companyId: body.company_id,
      timestamp: body.timestamp,
    });

    // TODO: Verify webhook signature to ensure it's from Genuka
    // This should check the X-Genuka-Signature header

    // Process webhook based on event type
    await processWebhook(body);

    // Return success response
    return {
      success: true,
      message: 'Webhook processed successfully',
    };

  } catch (error: any) {
    console.error('Webhook processing error:', {
      message: error.message,
      statusCode: error.statusCode,
    });

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Internal Server Error',
      message: error.message || 'Failed to process webhook',
    });
  }
});

/**
 * Process webhook based on event type
 */
async function processWebhook(event: WebhookEvent): Promise<void> {
  const { CompanyService } = await import('~/server/services/database/company.service');
  const companyService = new CompanyService();

  switch (event.type) {
    case WEBHOOK_EVENTS.COMPANY_UPDATED:
      // Update company information
      console.log('Processing company update:', event.company_id);
      // TODO: Fetch latest company data and update database
      // await companyService.update(event.company_id, event.data);
      break;

    case WEBHOOK_EVENTS.COMPANY_DELETED:
      // Handle company deletion
      console.log('Processing company deletion:', event.company_id);
      // TODO: Delete or archive company
      // await companyService.delete(event.company_id);
      break;

    case WEBHOOK_EVENTS.ORDER_CREATED:
      // Handle new order
      console.log('Processing new order:', event.data);
      // TODO: Implement order processing logic
      break;

    case WEBHOOK_EVENTS.ORDER_UPDATED:
      // Handle order update
      console.log('Processing order update:', event.data);
      // TODO: Implement order update logic
      break;

    case WEBHOOK_EVENTS.PRODUCT_CREATED:
      // Handle new product
      console.log('Processing new product:', event.data);
      // TODO: Implement product creation logic
      break;

    case WEBHOOK_EVENTS.PRODUCT_UPDATED:
      // Handle product update
      console.log('Processing product update:', event.data);
      // TODO: Implement product update logic
      break;

    default:
      console.warn('Unknown webhook event type:', event.type);
      // Don't throw error for unknown events, just log them
  }
}
