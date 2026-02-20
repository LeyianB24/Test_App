// Production environment
export const environment = {
  production: true,
  apiUrl: 'https://api.kra-itax.example.com/api', // Update with actual production domain

  app: {
    name: 'KRA iTax Portal',
    version: '1.0.0'
  },

  mpesa: {
    enabled: true,
    provider: 'safaricom',
    environment: 'production',

    // Production credentials - loaded from backend
    // These should NOT be hardcoded in frontend - loaded from secure endpoint
    consumerKey: '', // Set via backend endpoint
    consumerSecret: '', // Set via backend endpoint
    shortcode: '', // Set via backend endpoint
    passkey: '', // Set via backend endpoint (backend-only)

    // API endpoints
    endpoints: {
      initiate: '/payments/mpesa/initiate',
      callback: '/payments/mpesa/callback',
      status: '/payments/mpesa/status',
      validate: '/payments/validate',
      config: '/config/mpesa' // Load config from backend
    },

    // Payment settings
    minAmount: 100,
    maxAmount: 150000,
    currency: 'KES',

    // Timeout settings (milliseconds)
    requestTimeout: 30000,
    pollInterval: 3000,
    maxPolls: 20
  },

  features: {
    payments: true,
    exports: true,
    search: true,
    filters: true,
    userProfiles: true,
    auditLogging: true
  },

  notifications: {
    duration: 4000,
    position: 'top-right'
  },

  // Logging and monitoring
  logging: {
    enabled: false, // Disable verbose logging in production
    level: 'error'
  },

  // Security
  security: {
    enforceHttps: true,
    requireValidCertificate: true,
    tokenExpiry: 3600 // 1 hour
  }
};
