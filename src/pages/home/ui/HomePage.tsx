import type { Post } from '@/entities/post'

import styles from './homePage.module.css'

type Props = {
  posts: Post[]
  registeredUsersCount: number
}

export const HomePage = ({ posts, registeredUsersCount }: Props) => (
  <main className={styles.page}>
    <section className={styles.usersPanel}>
      <h1 className={styles.usersLabel}>Registered users:</h1>
      <p className={styles.visuallyHidden}>
        {registeredUsersCount.toLocaleString('en-US')} registered users
      </p>
      <span className={styles.usersCounter} aria-hidden="true">
        {Math.max(0, Math.trunc(registeredUsersCount))
          .toString()
          .padStart(6, '0')
          .split('')
          .map((digit, digitIndex) => (
            <span className={styles.counterDigit} key={`${digit}-${digitIndex}`}>
              {digit}
            </span>
          ))}
      </span>
    </section>
    <section aria-label="Latest publications">
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <article aria-hidden="true" className={styles.postPlaceholder} key={post.id} />
        ))}
      </div>
    </section>
  </main>
)
