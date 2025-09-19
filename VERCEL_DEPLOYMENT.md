# Vercel Deployment Guide for Google Docs Clone with Real-time Collaboration

## Prerequisites

1. **MongoDB Atlas Account**: You'll need a MongoDB Atlas account for the database
2. **Pusher Account**: Sign up at [pusher.com](https://pusher.com) for real-time WebSocket connections
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
4. **GitHub Account**: For connecting your repository to Vercel

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier is sufficient)
3. Create a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel deployment
5. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`)

## Step 2: Set up Pusher for Real-time Collaboration

1. Go to [pusher.com](https://pusher.com) and create a free account
2. Create a new app in your Pusher dashboard
3. Go to "App Keys" tab and note down:
   - **App ID**
   - **Key** 
   - **Secret**
   - **Cluster** (e.g., "us2", "eu", "ap-southeast-1")
4. Enable client events in your Pusher app settings:
   - Go to "App Settings" → "General"
   - Enable "Client Events"

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

### Option B: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./google-docs-clone-main`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/build`

## Step 4: Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add:

### Required Environment Variables:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `REACT_APP_SERVER_URL`: Your Vercel deployment URL (e.g., `https://your-project.vercel.app`)

### Pusher Environment Variables:

- `REACT_APP_PUSHER_KEY`: Your Pusher app key (public)
- `REACT_APP_PUSHER_CLUSTER`: Your Pusher cluster (e.g., "us2")
- `PUSHER_APP_ID`: Your Pusher app ID (server-side)
- `PUSHER_KEY`: Your Pusher app key (server-side)
- `PUSHER_SECRET`: Your Pusher app secret (server-side)
- `PUSHER_CLUSTER`: Your Pusher cluster (server-side)

## Step 5: Important Notes

### Changes Made for Vercel Compatibility

1. **Replaced Socket.IO with Pusher**: Used Pusher for real-time WebSocket connections that work with serverless functions
2. **Created API Routes**: Added `/api/documents/[id].js` for document operations
3. **Updated Client**: Modified TextEditor to use Pusher for real-time collaboration
4. **Environment Variables**: Updated configuration for production deployment with Pusher

### Features

- ✅ **Real-time Collaboration**: Multiple users can edit the same document simultaneously
- ✅ **Auto-save**: Documents are saved automatically every 2 seconds
- ✅ **Live Updates**: Changes appear instantly for all connected users
- ✅ **Serverless Compatible**: Works perfectly with Vercel's serverless functions

### How Real-time Collaboration Works

1. **Pusher Channels**: Each document gets its own Pusher channel (`document-{id}`)
2. **Client Events**: Users broadcast their changes directly to other clients
3. **Server Events**: Server broadcasts document saves to all connected users
4. **Delta Updates**: Only the changes (deltas) are transmitted, not the entire document

## Step 6: Testing Real-time Collaboration

After deployment:
1. Visit your Vercel URL
2. Create a new document (you'll be redirected to a new document ID)
3. Open the same document URL in multiple browser tabs/windows
4. Type content in one tab and watch it appear instantly in other tabs
5. Verify the "Last saved" indicator shows when documents are saved
6. Test with multiple users on different devices for full collaboration testing

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: 
   - Verify MongoDB Atlas connection string
   - Check IP whitelist includes 0.0.0.0/0
   - Ensure database user has proper permissions

2. **Pusher Connection Issues**:
   - Verify all Pusher environment variables are set correctly
   - Check that client events are enabled in Pusher dashboard
   - Ensure Pusher app is not paused or suspended
   - Check browser console for Pusher connection errors

3. **Real-time Collaboration Not Working**:
   - Verify Pusher credentials are correct
   - Check that both client and server Pusher keys match
   - Ensure Pusher cluster is set correctly
   - Test with multiple browser tabs first

4. **Build Failures**:
   - Check that all dependencies are installed
   - Verify Node.js version compatibility
   - Review build logs in Vercel dashboard

5. **API Errors**:
   - Check Vercel function logs
   - Verify environment variables are set
   - Test API endpoints directly

### Support

If you encounter issues:
1. Check Vercel function logs in the dashboard
2. Review MongoDB Atlas logs
3. Check Pusher dashboard for connection status and events
4. Test locally with the same environment variables
5. Use browser developer tools to check for JavaScript errors
