# Google Docs Clone

A real-time collaborative text editor built with React, Node.js, Socket.IO, and MongoDB.

## Features

- Real-time collaborative editing
- Rich text formatting with Quill.js
- Auto-save functionality
- Document sharing via unique URLs
- Responsive design

## Tech Stack

- **Frontend**: React, Quill.js, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB with Mongoose
- **Real-time**: WebSockets

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd google-docs-clone
```

2. Install dependencies
```bash
npm run install-all
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
PORT=3001
MONGODB_URI=mongodb://localhost/google-docs-clone
CLIENT_URL=http://localhost:3000
REACT_APP_SERVER_URL=http://localhost:3001
```

4. Start MongoDB
Make sure MongoDB is running on your system.

## Development

Start both client and server in development mode:
```bash
npm run dev
```

This will start:
- Server on http://localhost:3001
- Client on http://localhost:3000

## Production Deployment

### Heroku

1. Create a Heroku app
2. Set environment variables in Heroku dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `CLIENT_URL`: Your client URL
   - `REACT_APP_SERVER_URL`: Your server URL

3. Deploy:
```bash
git push heroku main
```

### Other Platforms

1. Build the client:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost/google-docs-clone |
| `CLIENT_URL` | Client URL for CORS | http://localhost:3000 |
| `REACT_APP_SERVER_URL` | Server URL for client | http://localhost:3001 |

## Project Structure

```
google-docs-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.js         # Main app component
│   │   ├── TextEditor.js  # Text editor component
│   │   └── styles.css     # Styles
│   └── package.json
├── server/                # Node.js backend
│   ├── server.js          # Main server file
│   ├── Document.js        # MongoDB model
│   └── package.json
├── package.json           # Root package.json
├── Procfile              # Heroku deployment
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
