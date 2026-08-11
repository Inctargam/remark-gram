import type { ReactNode } from 'react'

import styles from './legalDocumentPage.module.css'

type Props = {
  title: string
  children?: ReactNode
}

export const LegalDocumentPage = ({ title, children }: Props) => (
  <div className={styles.page}>
    <main className={styles.main}>
      <section className={styles.content} aria-labelledby="legal-document-title">
        <h1 className={styles.title} id="legal-document-title">
          {title}
        </h1>
        <div className={styles.text}>{children ?? <p>This page is a placeholder.</p>}</div>
      </section>
    </main>
  </div>
)
