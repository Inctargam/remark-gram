import { isProfileOwner } from '@/shared/auth'
import { Button } from '@/shared/ui/button'
import { ProfilePostsGrid } from '@/widgets/profile-posts'

import styles from './profilePage.module.css'

/**
 * Header data still has no endpoint of its own — the posts API is the only one mocked so far.
 * TODO(profile-api): replace with the profile query once the backend exposes user profiles.
 */
const PROFILE_PLACEHOLDER = {
  username: 'UserName',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  stats: [
    { label: 'Following', value: '2 218' },
    { label: 'Followers', value: '2 358' },
    { label: 'Publications', value: '2 764' },
  ],
} as const

type Props = {
  postId: string | null
  userId: string
}

export const ProfilePage = ({ userId }: Props) => {
  const isOwner = isProfileOwner(userId)

  return (
    <section className={styles.page} aria-labelledby="profile-title">
      <div className={styles.header}>
        <div className={styles.avatar} aria-hidden="true" />

        <div className={styles.summary}>
          <div className={styles.topRow}>
            <h1 className={styles.title} id="profile-title">
              {PROFILE_PLACEHOLDER.username}
            </h1>
            {isOwner ? (
              <Button className={styles.settingsButton} type="button" variant="secondary">
                Profile Settings
              </Button>
            ) : null}
          </div>

          <dl className={styles.stats} aria-label="Profile statistics">
            {PROFILE_PLACEHOLDER.stats.map(({ label, value }) => (
              <div className={styles.stat} key={label}>
                <dt className={styles.statLabel}>{label}</dt>
                <dd className={styles.statValue}>{value}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.description}>{PROFILE_PLACEHOLDER.description}</p>
        </div>
      </div>

      <div className={styles.posts}>
        <ProfilePostsGrid userId={userId} />
      </div>
    </section>
  )
}
