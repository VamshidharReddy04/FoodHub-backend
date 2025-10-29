# FoodHub Backend

Backend API for FoodHub application built with Node.js, Express, and MongoDB.

## Features

- User authentication (signup/login) with JWT
- Food items and categories data management
- RESTful API endpoints
- MongoDB integration
- CORS support for cross-origin requests

## API Endpoints

All API routes are available under the `/api` prefix:

- `POST /api/createuser` - Create a new user account (signup)
- `POST /api/login` - User login and authentication
- `POST /api/foodData` - Get food items and categories

Additional endpoints:
- `GET /` - Health check and test endpoint (returns food items)

## Environment Variables

### Required Environment Variables for Vercel Deployment

When deploying to Vercel, you need to configure the following environment variables:

#### `FRONTEND_URL` (Required for CORS)
- **Description**: The URL of your frontend application deployed on Vercel
- **Example**: `https://your-frontend.vercel.app`
- **Default**: `http://localhost:3000` (for local development)
- **Purpose**: Enables CORS (Cross-Origin Resource Sharing) to allow your frontend to make API requests to the backend

#### `PORT` (Optional)
- **Description**: The port on which the server runs
- **Default**: `5000`
- **Note**: Vercel handles this automatically in production

#### Database Configuration
**Note**: The MongoDB connection string is currently hardcoded in `db.js`. This is beyond the scope of this CORS configuration update but should be addressed in a future PR by moving to an environment variable:
- `MONGODB_URI` - Your MongoDB Atlas connection string

### Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   ```
   FRONTEND_URL = https://your-frontend.vercel.app
   ```
4. Click **Save**
5. Redeploy your application for changes to take effect

## Authentication & CORS

### JWT Authentication
This backend uses **JWT (JSON Web Token)** for authentication via the `Authorization` header:
- After successful login, the API returns an `authToken`
- Frontend should include this token in subsequent requests:
  ```
  Authorization: Bearer <authToken>
  ```

### CORS Configuration
The backend is configured to:
- Accept requests from the origin specified in `FRONTEND_URL`
- Allow credentials (cookies, authorization headers)
- Support preflight requests

**Note**: The current implementation uses JWT tokens in headers (not cookies). If you need to use cookies for authentication, ensure cookies are set with:
- `httpOnly: true` - Prevents XSS attacks
- `sameSite: 'none'` - Required for cross-origin requests
- `secure: true` - Required in production (HTTPS only)

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd FoodHub-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set environment variables for local development:
   ```bash
   export FRONTEND_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   
   Or for production mode:
   ```bash
   npm start
   ```

5. The server will start at `http://localhost:5000`

### Testing Locally

1. **Test CORS locally**:
   - Start the backend server (default: `http://localhost:5000`)
   - Start your frontend application (default: `http://localhost:3000`)
   - Make API requests from frontend to backend
   - Verify that CORS headers are present in responses

2. **Test API endpoints with curl**:
   ```bash
   # Health check
   curl http://localhost:5000/
   
   # Create user
   curl -X POST http://localhost:5000/api/createuser \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123","location":"Test City"}'
   
   # Login
   curl -X POST http://localhost:5000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   
   # Get food data
   curl -X POST http://localhost:5000/api/foodData
   ```

### Testing in Vercel

1. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the `vercel.json` configuration
   - Set the `FRONTEND_URL` environment variable in Vercel dashboard

2. **Verify deployment**:
   - Visit your Vercel backend URL: `https://your-backend.vercel.app/`
   - Should return food items data
   - Test API endpoints from your deployed frontend

3. **Test CORS**:
   - Open your frontend application deployed on Vercel
   - Open browser DevTools → Network tab
   - Perform login or data fetch operations
   - Verify:
     - No CORS errors in console
     - Response includes `Access-Control-Allow-Origin` header
     - Requests include proper Authorization headers

## Project Structure

```
FoodHub-backend/
├── Food/                    # JSON data files
├── Routes/                  # API route handlers
│   ├── CreateUser.js       # User authentication routes
│   └── DisplayData.js      # Food data routes
├── models/                  # Mongoose models
│   └── User.js             # User model
├── db.js                   # Database connection
├── index.js                # Main server entry point
├── package.json            # Project dependencies
├── vercel.json            # Vercel deployment configuration
└── README.md              # This file
```

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing middleware
- **cookie-parser**: Parse cookies from requests
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-validator**: Request validation

## Security Notes

**Current State** (existing code, not modified in this PR):
1. **JWT Secret**: Currently hardcoded in `Routes/CreateUser.js`. For production, should be moved to environment variable: `JWT_SECRET`
2. **MongoDB URI**: Currently hardcoded in `db.js`. For production, should be moved to environment variable: `MONGODB_URI`

**This PR's Security Enhancements**:
3. **CORS**: Properly configured to only allow requests from your specified frontend URL via `FRONTEND_URL` environment variable
4. **Credentials**: CORS credentials flag enabled to support secure authentication flows
5. **Password Hashing**: Uses bcryptjs with salt rounds for secure password storage (existing feature)

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` is correctly set in Vercel
- Ensure frontend URL matches exactly (including protocol: `https://`)
- Check browser console for specific CORS error messages

### Authentication Issues
- Verify JWT token is being sent in Authorization header
- Check token format: `Bearer <token>`
- Ensure token hasn't expired

### MongoDB Connection Issues
- Verify MongoDB Atlas IP whitelist includes Vercel IPs (or use `0.0.0.0/0` for all IPs)
- Check MongoDB connection string is valid
- Verify database user has proper permissions

## License

ISC
