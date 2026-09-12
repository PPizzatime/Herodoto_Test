/**
 * Payment Gateway Interfaces
 * Abstracts the underlying provider (Stripe, Apple In-App Purchases, Google Play Billing)
 */

export interface PaymentProvider {
  /** Initialize the payment flow for a subscription */
  createSubscription(userId: string, planId: string): Promise<PaymentSession>;
  
  /** Validate an incoming webhook from the provider */
  verifyWebhook(payload: any, signature: string): boolean;
  
  /** Cancel an active subscription */
  cancelSubscription(subscriptionId: string): Promise<boolean>;
}

export interface PaymentSession {
  sessionId: string;
  url?: string; // For web redirects (Stripe Checkout)
  clientSecret?: string; // For native SDKs
}
