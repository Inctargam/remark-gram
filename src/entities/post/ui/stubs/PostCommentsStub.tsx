import styles from './postStubs.module.css'

/**
 * TODO(comments): placeholder for the comments list — the comments feature does not exist yet.
 * Static markup on purpose: no props, no requests, no state, so replacing it with the real
 * feature means deleting `ui/stubs/` and changing one line in `PostView`.
 */
const PLACEHOLDER_COMMENTS = [
  {
    id: 'stub-comment-1',
    author: 'URLProfiles',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    meta: '2 Hours ago',
  },
  {
    id: 'stub-comment-2',
    author: 'URLProfiles',
    text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    meta: '2 Hours ago',
  },
] as const

export const PostCommentsStub = () => (
  <ul className={styles.comments} aria-label="Comments">
    {PLACEHOLDER_COMMENTS.map(({ id, author, text, meta }) => (
      <li className={styles.comment} key={id}>
        <span className={styles.avatar} aria-hidden="true" />
        <div>
          <p className={styles.commentBody}>
            <span className={styles.commentAuthor}>{author}</span>
            {text}
          </p>
          <p className={styles.commentMeta}>{meta}</p>
        </div>
      </li>
    ))}
  </ul>
)
