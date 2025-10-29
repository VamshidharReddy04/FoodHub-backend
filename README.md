# FoodHub Backend

Backend API for the FoodHub application, built with Express.js, MongoDB, and Node.js.

## Features

- User authentication (signup/login) with JWT
- Food items and categories management
- MongoDB integration with fallback to local JSON data
- CORS support for cross-origin requests
- Cookie-based authentication support

## API Endpoints

All API endpoints are prefixed with `/api`:

- `POST /api/createuser` - User signup
- `POST /api/login` - User login
- `POST /api/foodData` - Get food items and categories
- `GET /api/health` - Health check endpoint

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- MongoDB account or local MongoDB instance
- npm or yarn package manager

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

3. Create a `.env` file in the root directory (optional - defaults will be used if not provided):
```env
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
PORT=5000
```

4. Start the development server:
```bash
npm run dev
```

The server will start at `http://localhost:5000`.

### Local Testing

To test the backend locally with your frontend:

1. Ensure your frontend is running at `http://localhost:3000` (or update `FRONTEND_URL` in `.env`)
2. Start the backend server with `npm run dev`
3. Test the health endpoint: `curl http://localhost:5000/api/health`
4. Test user signup/login from your frontend application

## Deployment / Vercel

### Required Environment Variables

When deploying to Vercel, configure the following environment variables in your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:password@cluster.mongodb.net/dbname` |
| `FRONTEND_URL` | URL of your deployed frontend | `https://your-app.vercel.app` |
| `PORT` | Server port (optional) | `5000` |

### Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Variable name: `FRONTEND_URL`
   - Value: Your frontend Vercel URL (e.g., `https://your-frontend-app.vercel.app`)
   - Environment: Select Production, Preview, and Development as needed
4. Click **Save**
5. Repeat for `MONGODB_URI` and any other required variables
6. Redeploy your application for changes to take effect

### Cookie Configuration Notes

This backend is configured to work with cookies in production environments:

- **CORS credentials**: Enabled (`credentials: true`)
- **Cookie requirements for production**:
  - Frontend must be deployed on HTTPS
  - Cookies should use `SameSite=None` and `Secure` flags when sent from the backend
  - The `FRONTEND_URL` must match exactly with the origin sending requests

⚠️ **Important**: When working with cookies across different domains:
- Your frontend must include `credentials: 'include'` in fetch/axios requests
- The backend's `FRONTEND_URL` must match your frontend's exact URL
- Both frontend and backend should be on HTTPS in production

### Vercel Deployment Steps

1. Install Vercel CLI (optional):
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments:
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click **New Project**
- Import your GitHub repository
- Configure environment variables
- Deploy

3. The `vercel.json` configuration is already set up to route all requests to `index.js`.

### Testing on Vercel

After deployment:

1. Test the health endpoint:
```bash
curl https://your-backend.vercel.app/api/health
```

2. Update your frontend's API URL to point to your deployed backend
3. Test authentication and data fetching from your frontend

## Project Structure

```
FoodHub-backend/
├── Food/                   # JSON data files for food items and categories
├── Routes/                 # API route handlers
│   ├── CreateUser.js      # Authentication routes (signup, login)
│   └── DisplayData.js     # Food data routes
├── models/                 # Mongoose models
├── db.js                   # Database configuration and connection
├── index.js                # Main server entry point
├── package.json            # Dependencies and scripts
├── vercel.json            # Vercel deployment configuration
└── .gitignore             # Git ignore file
```

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB object modeling
- **cors** - CORS middleware
- **cookie-parser** - Cookie parsing middleware
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Request validation

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon (auto-restart on changes)
- `npm test` - Run tests (not configured yet)

## Troubleshooting

### CORS Errors

If you encounter CORS errors:
- Verify `FRONTEND_URL` matches your frontend's exact URL (including protocol)
- Check that your frontend includes `credentials: 'include'` in API requests
- Ensure cookies are properly configured with `SameSite` and `Secure` flags

### MongoDB Connection Issues

If MongoDB connection fails:
- Verify your `MONGODB_URI` is correct
- Check that your MongoDB cluster allows connections from Vercel's IP addresses
- The server will use fallback JSON data if MongoDB connection fails

### Cookie Issues in Production

If cookies aren't working:
- Ensure both frontend and backend are on HTTPS
- Set cookies with `SameSite=None; Secure` attributes
- Verify `FRONTEND_URL` environment variable matches your frontend URL exactly

## License

ISC

## Author

End to End
