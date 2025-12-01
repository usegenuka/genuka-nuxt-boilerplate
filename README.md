# Genuka Nuxt Boilerplate

A production-ready Nuxt 3 boilerplate for integrating with the Genuka e-commerce platform. This boilerplate provides OAuth authentication, webhook handling, and company data synchronization out of the box.

## 🌟 Features

- ✅ **OAuth 2.0 Integration** - Complete OAuth flow with Genuka
- ✅ **JWT Session Management** - Secure session handling with jose library
- ✅ **Double Cookie Security** - Session + refresh cookies for secure token refresh
- ✅ **Webhook Handling** - Receive and process Genuka events
- ✅ **Database Integration** - MySQL/MariaDB with Prisma ORM
- ✅ **TypeScript Support** - Fully typed codebase
- ✅ **Service Layer Architecture** - Clean separation of concerns
- ✅ **Frontend Composables** - Easy-to-use Vue composables
- ✅ **Environment Configuration** - Centralized config management
- ✅ **Error Handling** - Comprehensive error handling and logging

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **Bun** (recommended) or npm/yarn
- **MySQL** or **MariaDB** database
- **Genuka Account** with OAuth credentials

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/usegenuka/genuka-nuxt-boilerplate.git
cd genuka-nuxt-boilerplate

# Install dependencies
bun install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Required environment variables:**

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/genuka_db"

# Genuka OAuth
GENUKA_URL="https://api.genuka.com"
GENUKA_CLIENT_ID="your_client_id"
GENUKA_CLIENT_SECRET="your_client_secret"
GENUKA_REDIRECT_URI="http://localhost:3000/api/auth/callback"

# Application
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

### 3. Setup Database

```bash
# Generate Prisma client
bunx prisma generate

# Run database migration
bunx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
bunx prisma studio
```

### 4. Run Development Server

```bash
# Start development server
bun run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
genuka-nuxt-boilerplate/
├── app/                          # Nuxt app directory
│   └── app.vue                   # Main app component
├── server/                       # Server-side code
│   ├── api/                      # API endpoints
│   │   ├── auth/
│   │   │   ├── callback.get.ts   # OAuth callback handler
│   │   │   └── webhook.post.ts   # Webhook event handler
│   │   └── companies/
│   │       ├── index.get.ts      # Get all companies
│   │       └── [id].get.ts       # Get company by ID
│   ├── services/                 # Business logic
│   │   ├── auth/
│   │   │   └── oauth.service.ts  # OAuth service
│   │   ├── database/
│   │   │   └── company.service.ts # Company DB service
│   │   └── genuka/
│   │       └── api.service.ts    # Genuka API helper
│   └── utils/
│       └── prisma.ts             # Prisma client singleton
├── config/                       # Configuration
│   ├── env.ts                    # Environment config
│   └── constants.ts              # App constants
├── composables/                  # Vue composables
│   └── useGenuka.ts              # Genuka composable
├── types/                        # TypeScript types
│   └── company.ts                # Company types
├── prisma/                       # Database
│   └── schema.prisma             # Database schema
├── .env.example                  # Environment template
├── nuxt.config.ts                # Nuxt configuration
└── package.json                  # Dependencies
```

## 🔐 OAuth Flow

### How it works

1. **User initiates OAuth** - Your app redirects to Genuka authorization page
2. **User authorizes** - Genuka redirects back with authorization code
3. **Token exchange** - Your app exchanges code for access token
4. **Company sync** - Your app fetches and stores company data

### Implementation

**Frontend (Vue component):**

```vue
<template>
  <button @click="connectCompany">Connect to Genuka</button>
</template>

<script setup lang="ts">
const { initiateOAuth } = useGenuka();

const connectCompany = () => {
  const companyId = 'company_123'; // Get from your app
  initiateOAuth(companyId, '/dashboard');
};
</script>
```

**Backend (handled automatically):**

The callback endpoint (`/api/auth/callback`) automatically:
- Validates the OAuth parameters
- Exchanges the code for an access token
- Fetches company information from Genuka
- Stores/updates the company in your database
- Redirects the user to the specified URL

## 📡 Webhook Integration

### Configure Webhook URL

In your Genuka dashboard, set your webhook URL to:
```
https://yourdomain.com/api/auth/webhook
```

### Supported Events

The boilerplate handles these webhook events:

- `company.updated` - Company information changed
- `company.deleted` - Company deleted
- `order.created` - New order created
- `order.updated` - Order status changed
- `product.created` - New product added
- `product.updated` - Product information changed

### Customize Event Handlers

Edit [server/api/auth/webhook.post.ts](server/api/auth/webhook.post.ts) to add your business logic:

```typescript
case WEBHOOK_EVENTS.ORDER_CREATED:
  console.log('Processing new order:', event.data);
  // Your custom logic here
  break;
```

## 🗄️ Database

### Schema

The boilerplate includes a `Company` model with these fields:

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key (Genuka company ID) |
| handle | String | Unique company handle |
| name | String | Company name |
| description | Text | Company description |
| logoUrl | String | Logo URL |
| accessToken | Text | OAuth access token |
| refreshToken | Text | OAuth refresh token for session renewal |
| tokenExpiresAt | DateTime | Access token expiration date |
| authorizationCode | String | OAuth authorization code |
| phone | String | Contact phone |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

### Prisma Commands

```bash
# Generate Prisma Client
bunx prisma generate

# Create migration
bunx prisma migrate dev --name your_migration_name

# Apply migrations (production)
bunx prisma migrate deploy

# Reset database
bunx prisma migrate reset

# Open Prisma Studio
bunx prisma studio
```

## 🛠️ API Endpoints

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/auth/callback` | No | OAuth callback handler |
| POST | `/api/auth/webhook` | No | Webhook event handler |
| GET | `/api/auth/check` | No | Check if authenticated |
| POST | `/api/auth/refresh` | No | Refresh expired session |
| GET | `/api/auth/me` | Yes | Get current company info |
| POST | `/api/auth/logout` | Yes | Logout and destroy session |

### Company Endpoints

**GET** `/api/company/current`
- Returns current authenticated company

**GET** `/api/companies`
- Returns all companies

**GET** `/api/companies/:id`
- Returns specific company by ID

## 🔒 Authentication

### Double Cookie Security Pattern

This boilerplate uses a secure **double cookie pattern** for session management:

| Cookie | Duration | Purpose |
|--------|----------|---------|
| `session` | 7 hours | Access protected routes |
| `refresh_session` | 30 days | Securely refresh expired sessions |

Both cookies are **HTTP-only** (not accessible via JavaScript) and **signed JWT** (cannot be forged).

### Session Refresh (No Reinstall Required)

When the session expires, the client can securely refresh it:

```
POST /api/auth/refresh
// No body required! The refresh_session cookie is sent automatically
```

**Security Flow:**
1. Client calls `POST /api/auth/refresh` with no body
2. Server reads `refresh_session` cookie (HTTP-only, inaccessible to JS)
3. Server verifies the JWT signature (cannot be forged)
4. Server extracts `companyId` from the verified JWT
5. Server retrieves Genuka `refresh_token` from database
6. Server calls Genuka API with `refresh_token` + `client_secret`
7. Server updates tokens in database
8. Server creates new `session` + `refresh_session` cookies

**Why this is secure:**
- No data sent in request body (nothing to forge)
- `companyId` comes from a signed JWT cookie (tamper-proof)
- Cookies are HTTP-only (not accessible via JavaScript/XSS)
- Genuka `refresh_token` is never exposed to the client
- Genuka API validates with `client_secret` (server-side only)

## 💻 Frontend Usage

### Using the Genuka Composable

```typescript
const {
  // Reactive state
  company,         // Current company data (or null)
  isAuthenticated, // Boolean: is user logged in?
  isLoading,       // Boolean: is an auth operation in progress?
  error,           // Error message (or null)

  // Methods
  checkAuth,          // Check if session is valid
  getCurrentCompany,  // Fetch current company (auto-refreshes if needed)
  refresh,            // Manually refresh the session
  logout,             // Logout and destroy session
  initiateOAuth,      // Start OAuth flow
  isCompanyConnected, // Check if company has access token
} = useGenuka();
```

### Example: Auth-Aware Component

```vue
<template>
  <div>
    <div v-if="isLoading">Loading...</div>

    <div v-else-if="!isAuthenticated">
      <p>Please install the app from Genuka</p>
    </div>

    <div v-else>
      <h1>Welcome, {{ company?.name }}</h1>
      <button @click="handleRefresh">Refresh Session</button>
      <button @click="handleLogout">Logout</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const {
  company,
  isAuthenticated,
  isLoading,
  error,
  refresh,
  logout,
  getCurrentCompany,
} = useGenuka();

// Fetch company on mount
onMounted(async () => {
  await getCurrentCompany();
});

const handleRefresh = async () => {
  const success = await refresh();
  if (!success) {
    console.log('Please reinstall the app');
  }
};

const handleLogout = async () => {
  await logout();
};
</script>
```

### Handling 401 Errors

The `getCurrentCompany()` method automatically tries to refresh the session when it receives a 401. For custom API calls:

```typescript
const { refresh } = useGenuka();

async function fetchData() {
  try {
    const data = await $fetch('/api/my-endpoint');
    return data;
  } catch (err: any) {
    if (err.statusCode === 401) {
      const refreshed = await refresh();
      if (refreshed) {
        // Retry the request
        return await $fetch('/api/my-endpoint');
      }
    }
    throw err;
  }
}
```

### Initiate OAuth Flow

```vue
<template>
  <button @click="connectCompany">Connect to Genuka</button>
</template>

<script setup lang="ts">
const { initiateOAuth } = useGenuka();

const connectCompany = () => {
  const companyId = 'company_123';
  initiateOAuth(companyId, '/dashboard');
};
</script>
```

## 🔧 Configuration

### Environment Variables

See [.env.example](.env.example) for all available configuration options.

### Nuxt Runtime Config

Access config in your code:

```typescript
// Server-side (private)
const config = useRuntimeConfig();
console.log(config.genukaClientSecret);

// Client-side (public)
const config = useRuntimeConfig();
console.log(config.public.genukaUrl);
```

## 📦 Deployment

### Build for Production

```bash
# Build application
bun run build

# Preview production build
bun run preview
```

### Environment Setup

1. Set environment variables on your hosting platform
2. Run database migrations: `bunx prisma migrate deploy`
3. Generate Prisma client: `bunx prisma generate`
4. Start the application

### Hosting Recommendations

- **Vercel** - Zero-config deployment
- **Netlify** - Easy Nuxt integration
- **Railway** - Includes database hosting
- **DigitalOcean** - App Platform with MySQL

## 🧪 Testing

### Test OAuth Flow

1. Get your Genuka OAuth credentials
2. Configure `.env` with your credentials
3. Start dev server: `bun run dev`
4. Visit: `http://localhost:3000`
5. Trigger OAuth flow in your app
6. Verify company is stored in database

### Test Webhook

Use a tool like [ngrok](https://ngrok.com) to expose your local server:

```bash
# Expose local server
ngrok http 3000

# Update webhook URL in Genuka dashboard
https://your-ngrok-url.ngrok.io/api/auth/webhook

# Trigger events in Genuka dashboard
# Check console logs for webhook events
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check database is running
mysql -u root -p

# Verify DATABASE_URL format
DATABASE_URL="mysql://user:password@localhost:3306/database_name"

# Test Prisma connection
bunx prisma db push
```

### OAuth Errors

**"Invalid redirect URI"**
- Verify `GENUKA_REDIRECT_URI` matches the one in Genuka dashboard
- Must be exact match including protocol (http/https)

**"Invalid client credentials"**
- Double-check `GENUKA_CLIENT_ID` and `GENUKA_CLIENT_SECRET`
- Ensure no extra spaces in `.env` file

### Webhook Not Receiving Events

- Verify webhook URL is publicly accessible
- Check webhook URL in Genuka dashboard is correct
- Ensure your server is running
- Check server logs for errors

## 📝 Development Guide

### Adding New Features

1. **Add Database Model**
   - Update `prisma/schema.prisma`
   - Run `bunx prisma migrate dev`

2. **Create Service**
   - Add service in `server/services/`
   - Implement business logic

3. **Create API Endpoint**
   - Add endpoint in `server/api/`
   - Use service for data operations

4. **Add Frontend Composable**
   - Create composable in `composables/`
   - Use in Vue components

### Code Style

- Use TypeScript for all files
- Follow existing naming conventions
- Add JSDoc comments to functions
- Use Prettier for formatting

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Resources

- [Genuka Documentation](https://docs.genuka.com)
- [Nuxt 3 Documentation](https://nuxt.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OAuth 2.0 Guide](https://oauth.net/2/)

## 💬 Support

For issues and questions:

- **Genuka Support**: support@genuka.com
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [Genuka Docs](https://docs.genuka.com)

---

**Built with ❤️ in Cameroon** 🇨🇲

Made with [Nuxt](https://nuxt.com) and [Genuka](https://genuka.com)
