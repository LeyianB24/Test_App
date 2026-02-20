// Development environment
export const environment = {
  production: false,
  apiUrl: 'http://localhost/api',

  app: {
    name: 'KRA iTax Portal',
    version: '1.0.0'
  },

  mpesa: {
    enabled: true,
    provider: 'safaricom',
    environment: 'sandbox',

    // Reuse existing sandbox app from Test_App project
    consumerKey: 'GHIhl6RDankAZKubSkAg6EFBZrt5qZHzLH4HTGVvqOpadEK9',
    consumerSecret: 'jb3WEDJ2zDvBGG0U43VM7B9XyZdRAFrWVS4r3CjV9OLkikqnEVEZBpKknq45e3gp',
    shortcode: '174379',
    passkey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',

    // API endpoints
    endpoints: {
      initiate: '/payments/mpesa/initiate',
      callback: '/payments/mpesa/callback',
      status: '/payments/mpesa/status',
      validate: '/payments/validate'
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
  }
};
