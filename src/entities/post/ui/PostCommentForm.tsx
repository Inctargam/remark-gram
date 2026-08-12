import type { FormEvent } from 'react'

import styles from './postCommentForm.module.css'

type Props = {
  canPublish: boolean
  comment: string
  onCommentChange: (comment: string) => void
  onPublish: () => void
}

export const PostCommentForm = ({ canPublish, comment, onCommentChange, onPublish }: Props) => {
  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onPublish()
  }

  return (
    <form className={styles.commentForm} onSubmit={submitHandler}>
      <input
        className={styles.commentInput}
        type="text"
        placeholder="Add a Comment..."
        aria-label="Add a comment"
        value={comment}
        onChange={(event) => onCommentChange(event.currentTarget.value)}
      />
      <button className={styles.publishButton} type="submit" disabled={!canPublish}>
        Publish
      </button>
    </form>
  )
}
