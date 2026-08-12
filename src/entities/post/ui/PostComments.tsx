import type { PostComment } from '../model/postComments'
import styles from './postComments.module.css'

type Props = {
  comments: PostComment[]
}

export const PostComments = ({ comments }: Props) => (
  <ul className={styles.comments} aria-label="Comments">
    {comments.map(({ id, author, text, createdAtLabel }) => (
      <li className={styles.comment} key={id}>
        <span className={styles.avatar} aria-hidden="true" />
        <div>
          <p className={styles.commentBody}>
            <span className={styles.commentAuthor}>{author}</span>
            {text}
          </p>
          <p className={styles.commentMeta}>{createdAtLabel}</p>
        </div>
      </li>
    ))}
  </ul>
)
