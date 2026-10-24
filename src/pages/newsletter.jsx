import * as React from 'react'
import { useForm, ValidationError } from '@formspree/react'
import '../styles/global.css'
import SiteLayout from '../components/SiteLayout'
import { useI18n } from '../i18n/I18nProvider'
import { PageHead } from '../i18n/PageHead'

const NewsletterForm = () => {
  const { t } = useI18n()
  const [state, handleSubmit] = useForm('xqejrwpy')

  if (state.succeeded) {
    return (
      <div className="contact-form-success" role="status">
        <h2 className="contact-form-title">{t('newsletter.successTitle')}</h2>
        <p className="contact-form-success-text">{t('newsletter.success')}</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <h2 className="contact-form-title">{t('newsletter.formTitle')}</h2>
      <input type="hidden" name="_subject" value="Newsletter signup" />
      <input type="hidden" name="form_type" value="newsletter" />

      <div className="contact-form-field">
        <label htmlFor="newsletter-name">
          {t('newsletter.name')} <span className="contact-form-optional">{t('newsletter.optional')}</span>
        </label>
        <input id="newsletter-name" type="text" name="name" autoComplete="name" />
        <ValidationError prefix={t('newsletter.name')} field="name" errors={state.errors} className="contact-form-error" />
      </div>

      <div className="contact-form-field">
        <label htmlFor="newsletter-email">{t('newsletter.email')}</label>
        <input id="newsletter-email" type="email" name="email" autoComplete="email" required />
        <ValidationError prefix={t('newsletter.email')} field="email" errors={state.errors} className="contact-form-error" />
      </div>

      <div className="newsletter-consent">
        <input id="newsletter-consent" type="checkbox" name="consent" required />
        <label htmlFor="newsletter-consent">{t('newsletter.consent')}</label>
      </div>

      <ValidationError errors={state.errors} className="contact-form-error" />

      <button type="submit" className="contact-form-submit" disabled={state.submitting}>
        {state.submitting ? t('newsletter.submitting') : t('newsletter.subscribe')}
      </button>
    </form>
  )
}

const NewsletterPage = ({ location }) => {
  const { t } = useI18n()

  return (
    <SiteLayout location={location}>

      <main className="main-content newsletter-content">
        <div className="content-cards newsletter-cards">
          <div className="card card-primary newsletter-main-card">
            <h1 className="contact-page-title">{t('newsletter.title')}</h1>
            <div className="card-body">
              <p className="mission-text newsletter-lede">{t('newsletter.lede')}</p>
            </div>
          </div>

          <div className="card card-secondary newsletter-form-card">
            <NewsletterForm />
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}

export default NewsletterPage

export const Head = (props) => <PageHead pageKey="newsletter" {...props} />
