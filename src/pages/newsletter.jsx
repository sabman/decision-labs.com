import * as React from 'react'
import { useForm, ValidationError } from '@formspree/react'
import '../styles/global.css'
import SiteLayout from '../components/SiteLayout'

const NewsletterForm = () => {
  const [state, handleSubmit] = useForm('xqejrwpy')

  if (state.succeeded) {
    return (
      <div className="contact-form-success" role="status">
        <h2 className="contact-form-title">You are subscribed</h2>
        <p className="contact-form-success-text">
          Thanks for subscribing. We will send occasional updates from Decision Labs.
        </p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <h2 className="contact-form-title">Subscribe to Newsletter</h2>
      <input type="hidden" name="_subject" value="Newsletter signup" />
      <input type="hidden" name="form_type" value="newsletter" />

      <div className="contact-form-field">
        <label htmlFor="newsletter-name">
          Name <span className="contact-form-optional">(optional)</span>
        </label>
        <input id="newsletter-name" type="text" name="name" autoComplete="name" />
        <ValidationError prefix="Name" field="name" errors={state.errors} className="contact-form-error" />
      </div>

      <div className="contact-form-field">
        <label htmlFor="newsletter-email">Email</label>
        <input id="newsletter-email" type="email" name="email" autoComplete="email" required />
        <ValidationError prefix="Email" field="email" errors={state.errors} className="contact-form-error" />
      </div>

      <div className="newsletter-consent">
        <input id="newsletter-consent" type="checkbox" name="consent" required />
        <label htmlFor="newsletter-consent">I agree to receive email updates from Decision Labs.</label>
      </div>

      <ValidationError errors={state.errors} className="contact-form-error" />

      <button type="submit" className="contact-form-submit" disabled={state.submitting}>
        {state.submitting ? 'Subscribing…' : 'Subscribe'}
      </button>
    </form>
  )
}

const NewsletterPage = ({ location }) => {


  return (
    <SiteLayout location={location}>

      <main className="main-content newsletter-content">
        <div className="content-cards newsletter-cards">
          <div className="card card-primary newsletter-main-card">
            <h1 className="contact-page-title">Newsletter</h1>
            <div className="card-body">
              <p className="mission-text newsletter-lede">
                Monthly insights on geospatial data products, AI workflows, and practical lessons from our client work.
              </p>
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

export const Head = () => <title>Newsletter - Decision Labs</title>
