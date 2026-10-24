import * as React from 'react'
import DatalakeRolesSurvey, { copy } from '../components/DatalakeRolesSurvey'
import '../styles/global.css'

const Page = (props) => <DatalakeRolesSurvey {...props} lang="en" />

export default Page

export const Head = () => (
  <>
    <title>{copy.en.pageTitle}</title>
    <meta name="robots" content="noindex" />
  </>
)
