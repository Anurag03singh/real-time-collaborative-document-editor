const mongoose = require("mongoose")
const Document = require("./Document")

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/google-docs-clone"
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"

// MongoDB connection with error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

const io = require("socket.io")(PORT, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
})

const defaultValue = ""

io.on("connection", socket => {
  console.log('Client connected:', socket.id)
  
  socket.on("get-document", async documentId => {
    try {
      const document = await findOrCreateDocument(documentId)
      socket.join(documentId)
      socket.emit("load-document", document.data)
      console.log('Document loaded:', documentId)
    } catch (error) {
      console.error('Error loading document:', error)
      socket.emit("error", "Failed to load document")
    }

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
    })

    socket.on("save-document", async data => {
      try {
        await Document.findByIdAndUpdate(documentId, { data })
        console.log('Document saved:', documentId)
      } catch (error) {
        console.error('Error saving document:', error)
      }
    })
  })

  socket.on("disconnect", () => {
    console.log('Client disconnected:', socket.id)
  })
})

async function findOrCreateDocument(id) {
  if (id == null) return

  try {
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })
  } catch (error) {
    console.error('Error in findOrCreateDocument:', error)
    throw error
  }
}

// Start server
io.on('connect', () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})

console.log(`Server starting on port ${PORT}`)
console.log(`MongoDB URI: ${MONGODB_URI}`)
console.log(`Client URL: ${CLIENT_URL}`)
