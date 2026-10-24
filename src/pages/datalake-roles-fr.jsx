import * as React from 'react'
import DatalakeRolesSurvey, { copy } from '../components/DatalakeRolesSurvey'
import '../styles/global.css'

const Page = (props) => <DatalakeRolesSurvey {...props} lang="fr" />

export default Page

export const Head = () => (
  <>
    <title>{copy.fr.pageTitle}</title>
    <meta name="robots" content="noindex" />
    <html lang="fr" />
  </>
)
