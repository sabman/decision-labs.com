import * as React from 'react'
import { Link } from 'gatsby'
import '../styles/global.css'
import SiteLayout from '../components/SiteLayout'
import { useI18n } from '../i18n/I18nProvider'
import { localeHref } from '../i18n/routes'
import { PageHead } from '../i18n/PageHead'

const NotFoundPage = ({ location }) => {
  const { locale, t } = useI18n()

  return (
    <SiteLayout location={location}>
      <main className="main-content">
        <h1>{t('notFound.title')}</h1>
        <Link to={localeHref('home', locale)}>{t('notFound.home')}</Link>
      </main>
    </SiteLayout>
  )
}

export default NotFoundPage

export const Head = (props) => <PageHead pageKey="notFound" {...props} />
