import { useState, type Dispatch, type SetStateAction } from 'react'
import styles from './welcomeScreen.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

interface WelcomeScreenProps {
    setUser: Dispatch<SetStateAction<string | null>>
}

const WelcomeScreen = ({ setUser }: WelcomeScreenProps) => {
    const [userValue, setUserValue] = useState<string>('')

    return (
        <div className={styles.container}>
            <h3>Write your name to start the conversation</h3>
            <div className={styles.name}>
                <input
                    value={userValue}
                    onChange={(e) => setUserValue(e.target.value)}
                />
                <button onClick={() => setUser(userValue)}>
                    <FontAwesomeIcon icon={faCheck} />
                </button>
            </div>
        </div>
    )
}

export default WelcomeScreen
