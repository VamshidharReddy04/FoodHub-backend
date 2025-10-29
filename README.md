# FoodHub Backend

Backend API service for FoodHub food ordering application built with Node.js, Express, and MongoDB.

## Features

- User authentication (signup/login) with JWT
- Food items and categories management
- RESTful API endpoints
- CORS configuration for frontend integration
- Cookie-based session support

## API Endpoints

All API endpoints are exposed under `/api/*`:

- `POST /api/createuser` - User signup/registration
- `POST /api/login` - User login with JWT authentication
- `POST /api/foodData` - Get food items and categories
- `GET /api/health` - Health check endpoint
- `GET /` - Root endpoint with food items data

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database (MongoDB Atlas or local instance)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FoodHub-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (see Environment Variables section below)

4. Start the development server:
```bash
npm run dev
```

Or start in production mode:
```bash
npm start
```

## Environment Variables

The following environment variables should be configured:

### Required Variables

- `FRONTEND_URL` - Frontend application URL for CORS configuration
  - **Default**: `http://localhost:3000`
  - **Production example**: `https://your-frontend.vercel.app`

### Database Variables (if not hardcoded)

If you move the MongoDB URI to environment variables (recommended for production):

- `MONGO_URI` - MongoDB connection string
  - Example: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`

### Optional Variables

- `PORT` - Server port number (default: 5000)
- `JWT_SECRET` - Secret key for JWT token signing (currently hardcoded in CreateUser.js)

## Deployment to Vercel

### Step 1: Prepare Your Repository

Ensure your repository has:
- `vercel.json` configuration file (already included)
- All dependencies listed in `package.json`
- Environment variables configured

### Step 2: Deploy to Vercel

1. Install Vercel CLI (optional):
```bash
npm i -g vercel
```

2. Deploy using Vercel CLI:
```bash
vercel
```

Or connect your GitHub repository directly to Vercel through the Vercel dashboard.

### Step 3: Configure Environment Variables in Vercel

In your Vercel project settings, add the following environment variables:

1. **FRONTEND_URL**
   - Value: Your frontend URL (e.g., `https://your-frontend.vercel.app`)
   - This enables CORS for your specific frontend domain

2. **Database Credentials** (if using environment variables):
   - `MONGO_URI` - Your MongoDB connection string

To set environment variables in Vercel:
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate values
4. Redeploy your application for changes to take effect

### Step 4: Cookie Configuration for Production

When deploying to production (HTTPS), cookies require specific attributes:

**Important Cookie Settings:**
- `SameSite=None` - Required for cross-site cookies (frontend on different domain)
- `Secure=true` - Required when using SameSite=None (HTTPS only)

**Implementation Note:** 
If you plan to use cookies for authentication tokens (instead of localStorage), you'll need to update the login/signup routes to set cookies with these attributes:

```javascript
res.cookie('authToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
```

**Current Implementation:**
The current implementation returns JWT tokens in the response body. If you want to use cookie-based authentication instead, you'll need to:
1. Update CreateUser.js to set cookies in the response
2. Add middleware to read and verify cookies on protected routes
3. Update frontend to handle cookie-based authentication

### Step 5: Verify Deployment

After deployment, test your endpoints:

1. Health check:
```bash
curl https://your-backend.vercel.app/api/health
```

2. Test CORS by making requests from your frontend application

## Local Development and Testing

### Running Locally

1. Set the `FRONTEND_URL` environment variable (optional, defaults to `http://localhost:3000`):
```bash
export FRONTEND_URL=http://localhost:3000
npm run dev
```

2. Test the API endpoints:

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Create User:**
```bash
curl -X POST http://localhost:5000/api/createuser \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "location": "Test City"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Food Data:**
```bash
curl -X POST http://localhost:5000/api/foodData
```

### Testing CORS Locally

To test CORS with your frontend:

1. Start the backend server (default port 5000)
2. Start your frontend application (should be on port 3000 or set FRONTEND_URL accordingly)
3. Make API calls from your frontend
4. Check browser console for any CORS errors

### Testing with Different Frontend URLs

If your frontend runs on a different port or domain during development:

```bash
FRONTEND_URL=http://localhost:3001 npm run dev
```

Or for testing with a deployed frontend:

```bash
FRONTEND_URL=https://your-frontend.vercel.app npm run dev
```

## CORS Configuration Details

The backend is configured to accept requests from the frontend URL specified in the `FRONTEND_URL` environment variable.

**CORS Options:**
- `origin`: The frontend URL (from FRONTEND_URL env var)
- `credentials`: `true` (allows cookies and authorization headers)

**Supported Headers:**
- All standard headers via the cors package
- Custom headers will be automatically supported

**Supported Methods:**
- GET, POST, PUT, DELETE, OPTIONS

## Troubleshooting

### CORS Errors

If you encounter CORS errors:

1. Verify `FRONTEND_URL` is set correctly in your environment
2. Ensure your frontend URL matches exactly (including protocol and port)
3. Check that requests include credentials if needed
4. Verify the backend server is running and accessible

### Cookie Issues in Production

If cookies are not working in production:

1. Ensure your backend is served over HTTPS
2. Set `SameSite=None` and `Secure=true` on cookies
3. Verify CORS credentials are enabled (`credentials: true`)
4. Check browser console for cookie warnings

### Database Connection Issues

If MongoDB connection fails:

1. Verify your MongoDB URI is correct
2. Check network access settings in MongoDB Atlas
3. Ensure IP whitelist includes your deployment platform
4. Check MongoDB Atlas user permissions

## Project Structure

```
FoodHub-backend/
├── Food/                  # Food data JSON files
├── Routes/               # API route handlers
│   ├── CreateUser.js    # Authentication routes (signup/login)
│   └── DisplayData.js   # Food data routes
├── models/              # Mongoose models
│   └── User.js         # User model
├── db.js               # Database connection and utilities
├── index.js            # Main server file
├── package.json        # Dependencies and scripts
├── vercel.json        # Vercel deployment configuration
└── README.md          # This file
```

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - CORS middleware
- **cookie-parser** - Cookie parsing middleware
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Request validation

## Security Considerations

1. **JWT Secret**: Currently hardcoded in CreateUser.js. Move to environment variable for production.
2. **MongoDB URI**: Currently hardcoded in db.js. Move to environment variable for production.
3. **Password Hashing**: Uses bcrypt with salt rounds of 10 (secure).
4. **Input Validation**: Uses express-validator for request validation.
5. **CORS**: Restricted to specific frontend URL via environment variable.

## License

ISC

## Author

FoodHub Team
