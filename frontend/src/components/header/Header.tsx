import styles from './header.module.scss'

export const Header = () => {
    return (
        <header className={styles.container}>
            <div className={styles.content}>ChatUp</div>
        </header>
    )
}
