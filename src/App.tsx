import { useEffect, useState } from 'react';
import './App.css'

interface Message {
  type: string,
  timestamp: number,
  username: string | null,
  text: string
} 


function App() {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [user, setUser] = useState<string | null>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)


  useEffect(() => {
    let username = prompt('Write you name') || ''
    setUser(username)
  }, [])

  const getDateTime = (timestamp: number) => new Date(timestamp).toLocaleString('pl-PL')

  useEffect(() => {
    if (!user) return

    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("Connected to websocket server")
    }

    ws.onmessage = (msg) => {
      console.log(msg)
      setMessages((prev) => [...prev, JSON.parse(msg.data)])
    }

    setSocket(ws)
  }, [user])
  
  const handleSendMessage = () => {
    const newMessage: Omit<Message, 'timestamp'> = {
      type: "message",
      username: user,
      text: message
    }
    
    socket?.send(JSON.stringify(newMessage))
    setMessage('')
  }


  return (
    <>
    <h2>{user}</h2>
      <input value={message} onChange={(e) => setMessage(e.target.value)}/>
      <button onClick={handleSendMessage}>Send message</button>
      <ul>
        {messages.map((msg, i) => (
          <li key={`${i}_${msg.text}`}>
            <div><i>{getDateTime(msg.timestamp)}</i></div>
            <h4>{msg.username}</h4>
            <span>{msg.text}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
