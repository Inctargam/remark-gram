import { Button } from '@/shared/ui/button'

import styles from './profilePage.module.css'

const PROFILE_STATS = [
  { label: 'Following', value: '2 218' },
  { label: 'Followers', value: '2 358' },
  { label: 'Publications', value: '2 764' },
] as const

const PROFILE_POSTS = Array.from({ length: 8 }, (_, index) => index + 1)

export const ProfilePage = () => (
  <section className={styles.page} aria-labelledby="profile-title">
    <div className={styles.header}>
      <div className={styles.avatar} aria-hidden="true" />

      <div className={styles.summary}>
        <div className={styles.topRow}>
          <h1 className={styles.title} id="profile-title">
            UserName
          </h1>
          <Button className={styles.settingsButton} type="button" variant="secondary">
            Profile Settings
          </Button>
        </div>

        <dl className={styles.stats} aria-label="Profile statistics">
          {PROFILE_STATS.map(({ label, value }) => (
            <div className={styles.stat} key={label}>
              <dt className={styles.statLabel}>{label}</dt>
              <dd className={styles.statValue}>{value}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>

    <div className={styles.posts} aria-label="Profile publications">
      {PROFILE_POSTS.map((postNumber) => (
        <div
          className={styles.post}
          key={postNumber}
          aria-label={`Publication placeholder ${postNumber}`}
          role="img"
        />
      ))}
    </div>
  </section>
)
