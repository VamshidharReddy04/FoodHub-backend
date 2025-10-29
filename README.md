# FoodHub Backend

A Node.js Express backend API for the FoodHub food delivery application. This backend provides authentication, user management, and food item data services.

## Features

- User authentication with JWT tokens
- User signup and login endpoints
- Food items and categories data API
- MongoDB integration
- CORS configuration for frontend integration
- Vercel deployment ready

## Tech Stack

- **Node.js** & **Express.js** - Server framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

## API Endpoints

All routes are available under the `/api` prefix:

### Authentication Routes

#### POST `/api/createuser` - User Signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": "New York"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "location": "New York"
  }
}
```

#### POST `/api/login` - User Login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "authToken": "jwt_token_here"
}
```

### Data Routes

#### POST `/api/foodData` - Get Food Items
Retrieve food items and categories.

**Response:**
```json
[
  [/* array of food items */],
  [/* array of food categories */]
]
```

## Environment Variables

The following environment variables are required for deployment:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `FRONTEND_URL` | The URL of your frontend application (for CORS) | `https://your-frontend.vercel.app` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://username:password@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT token signing | `your-secure-random-string` |
| `PORT` | Port number for the server (optional, defaults to 5000) | `5000` |

### Setting Environment Variables in Vercel

1. Go to your project in the Vercel dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variables:
   - `FRONTEND_URL` - Set to your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string for JWT signing
4. Click **Save**
5. Redeploy your application for changes to take effect

### Local Development

Create a `.env` file in the root directory (not committed to git):

```env
FRONTEND_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

**Note:** If you don't set these variables, the application will use default values for local development.

## Authentication Method

This backend uses **JWT (JSON Web Token) authentication** with the following flow:

1. User logs in via `/api/login` endpoint
2. Backend validates credentials and returns a JWT token in the response body
3. Frontend stores the token (typically in localStorage or sessionStorage)
4. Frontend includes the token in subsequent requests using the `Authorization` header:
   ```
   Authorization: Bearer <token>
   ```

### Cookie-Based Authentication (Alternative)

If you want to implement cookie-based authentication in the future:

1. Modify the login route to send JWT in an httpOnly cookie:
   ```javascript
   res.cookie('authToken', token, {
     httpOnly: true,
     secure: true,        // Required for HTTPS
     sameSite: 'none',    // Required for cross-origin requests
     maxAge: 24 * 60 * 60 * 1000  // 24 hours
   });
   ```

2. The `cookie-parser` middleware is already configured in `index.js`

3. Update CORS to include credentials (already configured):
   ```javascript
   credentials: true
   ```

4. Frontend must include credentials in requests:
   ```javascript
   fetch(url, { credentials: 'include' })
   ```

**Note:** For production with HTTPS, cookies require `secure: true` and `sameSite: 'none'` for cross-origin requests.

## Local Development Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VamshidharReddy04/FoodHub-backend.git
   cd FoodHub-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables (optional for local dev):
   ```bash
   export FRONTEND_URL=http://localhost:3000
   export MONGODB_URI=your_mongodb_uri
   export JWT_SECRET=your_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

5. The server will start at `http://localhost:5000`

### Testing Locally with Frontend

1. Start the backend server:
   ```bash
   FRONTEND_URL=http://localhost:3000 node index.js
   ```

2. Start your frontend application on port 3000

3. Test the connection:
   - Navigate to your frontend
   - Try to login/signup
   - Check browser console for CORS errors (there should be none)
   - Verify API calls are successful

### Testing CORS Configuration

To test CORS with a different frontend URL:

```bash
FRONTEND_URL=http://localhost:3001 npm start
```

Then access your frontend from `http://localhost:3001`

## Deployment to Vercel

### Prerequisites

- Vercel account
- GitHub repository connected to Vercel

### Deployment Steps

1. **Push your code to GitHub**

2. **Import project in Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables:**
   - During import or in Project Settings > Environment Variables
   - Add all required environment variables (see above)

4. **Deploy:**
   - Vercel will automatically deploy your application
   - The `vercel.json` configuration is already set up

5. **Get your backend URL:**
   - After deployment, note your backend URL (e.g., `https://your-backend.vercel.app`)
   - Use this URL in your frontend application

6. **Update Frontend:**
   - Update your frontend to use the Vercel backend URL
   - Ensure CORS is working by testing API calls

### Vercel Configuration

The `vercel.json` file is already configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

## Troubleshooting

### CORS Issues

**Problem:** Frontend shows CORS errors

**Solutions:**
1. Verify `FRONTEND_URL` environment variable is set correctly in Vercel
2. Ensure frontend URL matches exactly (including protocol: http/https)
3. Check that credentials are included in frontend requests if using cookies
4. Redeploy after changing environment variables

### Authentication Issues

**Problem:** JWT token not working

**Solutions:**
1. Verify `JWT_SECRET` is set in environment variables
2. Check token is being sent in `Authorization` header as `Bearer <token>`
3. Ensure token hasn't expired

### Database Connection Issues

**Problem:** Cannot connect to MongoDB

**Solutions:**
1. Verify `MONGODB_URI` environment variable is correct
2. Check MongoDB Atlas IP whitelist (allow all IPs: `0.0.0.0/0` for Vercel)
3. Verify database user has correct permissions

### Deployment Issues

**Problem:** Vercel deployment fails

**Solutions:**
1. Check Vercel build logs for errors
2. Verify all dependencies are in `package.json`
3. Ensure `index.js` is the correct entry point
4. Check Node.js version compatibility

## Project Structure

```
FoodHub-backend/
├── Food/
│   ├── foodData2.json      # Sample food items data
│   └── foodCategory.json   # Food categories data
├── models/
│   └── User.js             # User model schema
├── Routes/
│   ├── CreateUser.js       # Authentication routes (signup/login)
│   └── DisplayData.js      # Food data routes
├── db.js                   # Database connection and utilities
├── index.js                # Main server entry point
├── package.json            # Project dependencies
├── vercel.json            # Vercel deployment configuration
└── README.md              # This file
```

## Security Notes

1. **JWT Secret:** Always use a strong, random string for `JWT_SECRET` in production
2. **MongoDB URI:** Keep your database credentials secure, never commit them to git
3. **CORS:** Only allow trusted frontend URLs in `FRONTEND_URL`
4. **Passwords:** All passwords are hashed using bcrypt before storage
5. **HTTPS:** Always use HTTPS in production (Vercel provides this by default)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Author

End to end

## Support

For issues and questions, please open an issue on GitHub.
