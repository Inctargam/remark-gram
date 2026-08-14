import styles from './homePage.module.css'

type Props = {
  value: number
}

const COUNTER_DIGITS_COUNT = 6

export const HomeRegisteredUsersCounter = ({ value }: Props) => {
  const digits = Math.max(value, 0).toString().padStart(COUNTER_DIGITS_COUNT, '0').split('')

  return (
    <section className={styles.usersCounter} aria-labelledby="registered-users-title">
      <h1 className={styles.usersCounterTitle} id="registered-users-title">
        Registered users:
      </h1>
      <div
        className={styles.usersCounterDigits}
        role="group"
        aria-label={`${value.toLocaleString()} registered users`}>
        {digits.map((digit, index) => (
          <span className={styles.usersCounterDigit} key={`${digit}-${index}`} aria-hidden="true">
            {digit}
          </span>
        ))}
      </div>
    </section>
  )
}
