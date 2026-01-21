import { useEffect, useRef, useState } from 'react'
import WelcomeScreen from '../welcome-screen/WelcomeScreen'
import styles from './chat.module.scss'
import { Dialog } from '../dialog/Dialog'

export interface Message {
    type: string
    timestamp: number
    username: string | null
    text: string
}

const WS_URL = import.meta.env.PROD
    ? 'wss://chat-app-l6fi.onrender.com'
    : 'ws://localhost:3000'

export const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [user, setUser] = useState<string | null>('')

    const socketRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<number | null>(null)

    useEffect(() => {
        if (!user) return

        const connect = () => {
            const ws = new WebSocket(WS_URL)
            socketRef.current = ws

            ws.onopen = () => {
                console.log('Connected to websocket server')
            }

            ws.onmessage = (msg) => {
                console.log(msg)
                setMessages((prev) => [...prev, JSON.parse(msg.data)])
            }

            ws.onclose = () => {
                console.log('Connection lost, retrying...')
                reconnectTimeoutRef.current = window.setTimeout(connect, 2000)
            }
            ws.onerror = () => {
                WS_URL.toLocaleLowerCase()
            }
        }

        connect()

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
            socketRef.current?.close()
        }
    }, [user])

    return (
        <main className={styles.container}>
            {!user ? (
                <WelcomeScreen setUser={setUser} />
            ) : (
                <Dialog user={user} messages={messages} socketRef={socketRef} />
            )}
        </main>
    )
}
