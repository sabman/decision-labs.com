import * as React from 'react'
import { Link } from 'gatsby'
import { Mail, Calendar } from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import '../styles/global.css'

const ContactPage = ({ location }) => {

  
  return (
    <SiteLayout location={location}>

      <main className="main-content contact-content">
        <div className="content-cards contact-cards">
          <div className="card card-primary contact-main-card">
            <h1 className="contact-page-title">Contact</h1>
            <div className="card-body">
              <p className="mission-text">
                Let's discuss how we can help transform your data into actionable insights. Reach out to start a conversation about your next project.
              </p>
            </div>
            <div className="card-footer">
            </div>
          </div>

          <div className="contact-links-container">
            <div className="contact-links-grid">
              <a href="https://github.com/decision-labs/" className="contact-link-card" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <FaGithub size={24} />
                </div>
                <div className="contact-link-label">GitHub</div>
              </a>
              <a href="mailto:team@decision-labs.com" className="contact-link-card">
                <div className="contact-link-icon">
                  <Mail size={24} className="lucide-icon" />
                </div>
                <div className="contact-link-label">Email</div>
              </a>
              <a href="https://www.linkedin.com/company/spacialdb-ug-decision-labs/" className="contact-link-card" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <FaLinkedin size={24} />
                </div>
                <div className="contact-link-label">LinkedIn</div>
              </a>
              <a href="https://twitter.com/geobaseapp" className="contact-link-card" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <FaXTwitter size={24} />
                </div>
                <div className="contact-link-label">Twitter</div>
              </a>
              <a href="https://cal.com/decision-labs" className="contact-link-card contact-link-card-wide" target="_blank" rel="noopener noreferrer">
                <div className="contact-link-icon">
                  <Calendar size={24} className="lucide-icon" />
                </div>
                <div className="contact-link-label">Book a Call</div>
                <div className="contact-link-helper">30-minute consultation • Free • No commitment</div>
              </a>
              <Link to="/newsletter" className="contact-link-card contact-link-card-wide">
                <div className="contact-link-icon">
                  <Mail size={24} className="lucide-icon" />
                </div>
                <div className="contact-link-label">Newsletter</div>
                <div className="contact-link-helper">Sign up for practical updates from Decision Labs</div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}

export default ContactPage

export const Head = () => <title>Contact - Decision Labs</title>

