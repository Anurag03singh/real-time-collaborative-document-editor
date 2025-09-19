const mongoose = require("mongoose");
const Document = require("../../server/Document");
const Pusher = require("pusher");

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "2053184",
  key: process.env.PUSHER_KEY || "f5a316bda9db4bc7f274",
  secret: process.env.PUSHER_SECRET || "44ae4ba5c6eeb2233060",
  cluster: process.env.PUSHER_CLUSTER || "ap2",
  useTLS: true
});

// MongoDB connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://anuragwrk03_db_user:AIWAscRhR22lwYk1@cluster0.cvdxnea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await connectDB();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const document = await findOrCreateDocument(id);
      res.status(200).json({ data: document.data });
    } catch (error) {
      console.error("Error loading document:", error);
      res.status(500).json({ error: "Failed to load document" });
    }
  } else if (req.method === "PUT") {
    try {
      const { data, delta } = req.body;
      
      // Save document to database
      await Document.findByIdAndUpdate(id, { data });
      
      // If delta is provided, broadcast changes to other clients
      if (delta) {
        await pusher.trigger(`document-${id}`, "receive-changes", delta);
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error saving document:", error);
      res.status(500).json({ error: "Failed to save document" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function findOrCreateDocument(id) {
  if (id == null) return;

  try {
    const document = await Document.findById(id);
    if (document) return document;
    return await Document.create({ _id: id, data: "" });
  } catch (error) {
    console.error("Error in findOrCreateDocument:", error);
    throw error;
  }
}
