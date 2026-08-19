import { LegalDocumentPage } from './LegalDocumentPage'
import { LegalDocumentPlaceholder } from './LegalDocumentPlaceholder'

export const PrivacyPolicyPage = () => (
  <LegalDocumentPage title="Privacy Policy">
    <p>
      Location data is provided by{' '}
      <a
        href="https://github.com/dr5hn/countries-states-cities-database"
        rel="noreferrer"
        target="_blank">
        Countries States Cities Database
      </a>{' '}
      and is available under the{' '}
      <a href="https://opendatacommons.org/licenses/odbl/1-0/" rel="noreferrer" target="_blank">
        Open Database License 1.0
      </a>
      {'.'}
    </p>
    <LegalDocumentPlaceholder />
  </LegalDocumentPage>
)
