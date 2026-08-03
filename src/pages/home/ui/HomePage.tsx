import type { Post } from '@/entities/post'
import { PostThumbnail } from '@/entities/post'

import styles from './homePage.module.css'

type Props = {
  posts: Post[]
  registeredUsersCount: number
}

export const HomePage = ({ posts, registeredUsersCount }: Props) => (
  <div className={styles.page}>
    <section className={styles.hero}>
      <h1 className={styles.title}>Inctagram</h1>
      <p className={styles.subtitle}>
        <span className={styles.count}>{registeredUsersCount.toLocaleString()}</span> registered
        users
      </p>
      <p className={styles.latestLabel}>Latest publications</p>
    </section>
    <section className={styles.posts}>
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <PostThumbnail key={post.id} post={post} />
        ))}
      </div>
    </section>
  </div>
)
