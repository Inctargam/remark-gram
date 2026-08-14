import type { Post } from '@/entities/post'

import styles from './homePage.module.css'
import { HomePostsGrid } from './HomePostsGrid'
import { HomeRegisteredUsersCounter } from './HomeRegisteredUsersCounter'

type Props = {
  posts: Post[]
  registeredUsersCount: number
}

export const HomePage = ({ posts, registeredUsersCount }: Props) => (
  <main className={styles.page}>
    <HomeRegisteredUsersCounter value={registeredUsersCount} />
    <section className={styles.posts} aria-label="Latest publications">
      <HomePostsGrid posts={posts} />
    </section>
  </main>
)
