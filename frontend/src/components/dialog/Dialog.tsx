import { useCallback, useState, type RefObject } from 'react'
import styles from './dialog.module.scss'
import type { Message } from '../chat/Chat'

const getDateTime = (timestamp: number) =>
    new Date(timestamp).toLocaleString('pl-PL')

interface DialogProps {
    user: string
    messages: Message[]
    socketRef: RefObject<WebSocket | null>
}

export const Dialog = ({ user, messages, socketRef }: DialogProps) => {
    const [message, setMessage] = useState<string>('')

    const handleSendMessage = useCallback(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            const newMessage: Omit<Message, 'timestamp'> = {
                type: 'message',
                username: user,
                text: message
            }

            socketRef.current.send(JSON.stringify(newMessage))
            setMessage('')
        }
    }, [message])

    return (
        <div className={styles.container}>
            <h2>{user}</h2>
            <div className={styles['message-wrapper']}>
                <ul className={styles['message-list']}>
                    {messages.map((msg, i) => (
                        <li key={`${i}_${msg.text}`} className={styles.message}>
                            <div className={styles['message-metadata']}>
                                <i>{getDateTime(msg.timestamp)}</i>
                                <h4>{msg.username}</h4>
                            </div>
                            <span>{msg.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.footer}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send message</button>
            </div>
        </div>
    )
}
