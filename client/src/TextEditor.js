import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { useParams } from "react-router-dom"
import Pusher from "pusher-js"

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor() {
  const { id: documentId } = useParams()
  const [quill, setQuill] = useState()
  const [pusher, setPusher] = useState()
  const [channel, setChannel] = useState()
  const [lastSaved, setLastSaved] = useState(null)

  // Initialize Pusher connection
  useEffect(() => {
    const pusherClient = new Pusher(process.env.REACT_APP_PUSHER_KEY || "f5a316bda9db4bc7f274", {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER || "ap2",
      forceTLS: true
    })
    
    setPusher(pusherClient)
    
    return () => {
      pusherClient.disconnect()
    }
  }, [])

  // Set up channel and real-time collaboration
  useEffect(() => {
    if (pusher == null || quill == null) return

    const docChannel = pusher.subscribe(`document-${documentId}`)
    setChannel(docChannel)

    // Listen for changes from other users
    docChannel.bind("receive-changes", (delta) => {
      quill.updateContents(delta, "api")
    })

    return () => {
      pusher.unsubscribe(`document-${documentId}`)
    }
  }, [pusher, quill, documentId])

  // Load document on mount
  useEffect(() => {
    if (quill == null) return

    const loadDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`)
        const { data } = await response.json()
        quill.setContents(data)
        quill.enable()
      } catch (error) {
        console.error("Error loading document:", error)
        quill.setText("Error loading document")
      }
    }

    loadDocument()
  }, [quill, documentId])

  // Handle text changes and broadcast to other users
  useEffect(() => {
    if (quill == null || channel == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      
      // Broadcast changes to other users immediately
      channel.trigger("client-send-changes", delta)
    }

    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [quill, channel])

  // Auto-save document
  useEffect(() => {
    if (quill == null) return

    const interval = setInterval(async () => {
      try {
        const content = quill.getContents()
        await fetch(`/api/documents/${documentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: content }),
        })
        setLastSaved(new Date().toLocaleTimeString())
      } catch (error) {
        console.error("Error saving document:", error)
      }
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [quill, documentId])

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, [])

  return (
    <div>
      <div className="container" ref={wrapperRef}></div>
      {lastSaved && (
        <div style={{ 
          position: "fixed", 
          bottom: "10px", 
          right: "10px", 
          background: "#f0f0f0", 
          padding: "5px 10px", 
          borderRadius: "5px",
          fontSize: "12px"
        }}>
          Last saved: {lastSaved}
        </div>
      )}
    </div>
  )
}
