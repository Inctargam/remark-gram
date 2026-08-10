import { LEGAL_DOCUMENT_PLACEHOLDER_PARAGRAPHS } from '../model/legalDocumentPlaceholder'

export const LegalDocumentPlaceholder = () => (
  <>
    {LEGAL_DOCUMENT_PLACEHOLDER_PARAGRAPHS.map((paragraph) => (
      <p key={paragraph}>{paragraph}</p>
    ))}
  </>
)
