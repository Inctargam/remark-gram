import Link from 'next/link'
import type { ReactNode } from 'react'

import { ROUTES } from '@/shared/config'
import { Icon } from '@/shared/ui/icon'

import styles from './legalDocumentPage.module.css'
import { LegalDocumentPlaceholder } from './LegalDocumentPlaceholder'

type Props = {
  title: string
  children?: ReactNode
}

export const LegalDocumentPage = ({ title, children }: Props) => (
  <div className={styles.page}>
    <main className={styles.main}>
      <section className={styles.content} aria-labelledby="legal-document-title">
        <Link aria-label="Back to Sign Up" className={styles.backLink} href={ROUTES.signUp}>
          <Icon iconId="icon-arrow-back-outline" />
          <span className={styles.backLabel}>Back to Sign Up</span>
        </Link>
        <h1 className={styles.title} id="legal-document-title">
          {title}
        </h1>
        <div className={styles.text}>{children ?? <LegalDocumentPlaceholder />}</div>
      </section>
    </main>
  </div>
)
