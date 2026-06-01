import { Header } from '@/widgets/header'

import styles from './legalPlaceholderPage.module.css'

type Props = {
  title: string
}

export const LegalPlaceholderPage = ({ title }: Props) => (
  <div className={styles.page}>
    <Header variant="guest" />
    <main className={styles.main}>
      <section className={styles.content} aria-labelledby="legal-placeholder-title">
        <h1 className={styles.title} id="legal-placeholder-title">
          {title}
        </h1>
        <p className={styles.text}>This page is a placeholder.</p>
      </section>
    </main>
  </div>
)
