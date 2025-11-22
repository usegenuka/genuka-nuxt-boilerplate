import { WEBHOOK_EVENTS } from '~~/config/constants';
import type { WebhookEvent } from '~~/types/company';

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

    console.log('Webhook received:', {
      type: body.type,
      companyId: body.company_id,
      timestamp: body.timestamp,
    });

    // TODO: Verify webhook signature to ensure it's from Genuka
    
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
  // const { CompanyService } = await import('~~/server/services/database/company.service');
  // Implement this
}
