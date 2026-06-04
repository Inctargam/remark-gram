import styles from './legalDocumentPage.module.css'

type Props = {
  title: string
}

export const LegalDocumentPage = ({ title }: Props) => (
  <div className={styles.page}>
    <main className={styles.main}>
      <section className={styles.content} aria-labelledby="legal-document-title">
        <h1 className={styles.title} id="legal-document-title">
          {title}
        </h1>
        <p className={styles.text}>This page is a placeholder.</p>
      </section>
    </main>
  </div>
)
