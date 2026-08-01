import styles from './postStubs.module.css'

/**
 * TODO(comments): placeholder for the "add a comment" row.
 * The input and the button are disabled — there is nothing to send them to yet.
 */
export const PostCommentFormStub = () => (
  <div className={styles.commentForm}>
    <input
      className={styles.commentInput}
      type="text"
      placeholder="Add a Comment..."
      aria-label="Add a comment"
      disabled
    />
    <button className={styles.publishButton} type="button" disabled>
      Publish
    </button>
  </div>
)
