import { useId } from 'react'

import type { PostComment } from '../model/postComments'
import styles from './postComments.module.css'

type Props = {
  comments: PostComment[]
  expandedCommentIds: Set<string>
  onAnswerToggle: (commentId: string) => void
}

const formatAnswersLabel = (commentsCount: number) => `View Answers (${commentsCount})`

export const PostComments = ({ comments, expandedCommentIds, onAnswerToggle }: Props) => {
  const repliesIdPrefix = useId()

  return (
    <ul className={styles.comments} aria-label="Comments">
      {comments.map(({ id, author, text, createdAtLabel, replies = [] }) => {
        const areRepliesVisible = expandedCommentIds.has(id)
        const repliesId = `${repliesIdPrefix}-${id}-replies`

        return (
          <li className={styles.comment} key={id}>
            <span className={styles.avatar} aria-hidden="true" />
            <div className={styles.commentContent}>
              <p className={styles.commentBody}>
                <span className={styles.commentAuthor}>{author}</span>
                {text}
              </p>
              <p className={styles.commentMeta}>{createdAtLabel}</p>

              {replies.length > 0 ? (
                <button
                  className={styles.answersToggle}
                  type="button"
                  aria-controls={repliesId}
                  aria-expanded={areRepliesVisible}
                  onClick={() => onAnswerToggle(id)}>
                  <span className={styles.answersLine} aria-hidden="true" />
                  <span>
                    {areRepliesVisible ? 'Hide Answers' : formatAnswersLabel(replies.length)}
                  </span>
                </button>
              ) : null}

              {areRepliesVisible ? (
                <ul className={styles.replies} id={repliesId} aria-label="Comment answers">
                  {replies.map((reply) => (
                    <li className={styles.reply} key={reply.id}>
                      <span className={styles.avatar} aria-hidden="true" />
                      <div>
                        <p className={styles.commentBody}>
                          <span className={styles.commentAuthor}>{reply.author}</span>
                          {reply.text}
                        </p>
                        <p className={styles.commentMeta}>{reply.createdAtLabel}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
