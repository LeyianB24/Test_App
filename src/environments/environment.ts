// Development environment
export const environment = {
  production: false,
  apiUrl: 'http://localhost/itax/kra-api',

  app: {
    name: 'KRA iTax Portal',
    version: '2.4.0-elite'
  },

  // JWT Authentication Configuration
  auth: {
    // Token lifetimes (in seconds)
    accessTokenLifetime: 900,        // 15 minutes
    refreshTokenLifetime: 604800,    // 7 days

    // Storage keys
    accessTokenKey: 'authToken',
    refreshTokenKey: 'refreshToken',
    userKey: 'currentUser',

    // JWT Endpoints
    endpoints: {
      login: '/auth_jwt.php?action=login',
      refresh: '/auth_jwt.php?action=refresh',
      logout: '/auth_jwt.php?action=logout',
      status: '/status.php'
    }
  },

  // Role-Based Access Control
  rbac: {
    endpoints: {
      getMatrix: '/admin_role_matrix.php?action=get_matrix',
      upsertPermission: '/admin_role_matrix.php?action=upsert_permission',
      getNavigation: '/admin_role_matrix.php?action=get_navigation'
    },
    // Default roles with their descriptions
    roles: {
      SUPER_ADMIN: 'System Administrator with full access',
      ADMIN: 'Administrator with limited access',
      USER: 'Standard user with basic access'
    }
  },

  mpesa: {
    enabled: true,
    provider: 'safaricom',
    environment: 'sandbox',

    // Reuse existing sandbox app from Test_App project
    consumerKey: 'S7VWa91v8dfBt4Zd5lL8GkQH8Ys2naiteO6zCB5eHdtHCUoI',
    consumerSecret: 'PUNdBuECV9ZNKdnvHOG5YrMKgf2BUZzecvLSGlna0aJOlK2VxEYApvISgPvs0Gvx',
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
    auditLogging: true,
    roleMatrix: true,
    debugLogging: true
  },

  notifications: {
    duration: 4000,
    position: 'top-right'
  },

  // External Service Health Checks
  externalServices: {
    itax: {
      name: 'iTax Portal',
      url: 'https://itax.kra.go.ke',
      timeout: 5000
    },
    ecitizen: {
      name: 'eCitizen',
      url: 'https://www.ecitizen.go.ke',
      timeout: 5000
    }
  }
};

