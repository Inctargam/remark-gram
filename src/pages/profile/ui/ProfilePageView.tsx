'use client'

import type { Post } from '@/entities/post'
import { useCurrentUser } from '@/shared/auth'
import { ProfilePostsGrid } from '@/widgets/profile-posts'

import type { PublicProfile } from '../model/publicProfile'
import styles from './profilePage.module.css'
import { ProfileSettingsControl } from './ProfileSettingsControl'

type ProfileStat = {
  label: string
  value: string
}

export type ProfilePageViewProps = {
  initialSelectedPost: Post | null
  profile: PublicProfile
  userId: string
}

const formatProfileCount = (count: number) => new Intl.NumberFormat('ru-RU').format(count)

const getProfileStats = ({
  followersCount,
  followingCount,
  publicationsCount,
}: PublicProfile): ProfileStat[] => [
  { label: 'Following', value: formatProfileCount(followingCount) },
  { label: 'Followers', value: formatProfileCount(followersCount) },
  { label: 'Publications', value: formatProfileCount(publicationsCount) },
]

export const ProfilePageView = ({ initialSelectedPost, profile, userId }: ProfilePageViewProps) => {
  const currentUser = useCurrentUser()
  const username = currentUser?.id === userId ? currentUser.username : profile.username
  const stats = getProfileStats(profile)

  return (
    <section className={styles.page} aria-labelledby="profile-title">
      <div className={styles.header}>
        <div className={styles.avatar} aria-hidden="true" />

        <div className={styles.summary}>
          <div className={styles.topRow}>
            <h1 className={styles.title} id="profile-title">
              {username}
            </h1>
            <ProfileSettingsControl userId={userId} />
          </div>

          <dl className={styles.stats} aria-label="Profile statistics">
            {stats.map(({ label, value }) => (
              <div className={styles.stat} key={label}>
                <dt className={styles.statLabel}>{label}</dt>
                <dd className={styles.statValue}>{value}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.description}>{profile.description}</p>
        </div>
      </div>

      <div className={styles.posts}>
        <ProfilePostsGrid initialSelectedPost={initialSelectedPost} userId={userId} />
      </div>
    </section>
  )
}
