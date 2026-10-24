import * as React from 'react'
import '../styles/global.css'
import SiteLayout from '../components/SiteLayout'
import { useI18n } from '../i18n/I18nProvider'
import { localizedField } from '../i18n/content'
import { PageHead } from '../i18n/PageHead'
import customersData from '../data/customers.json'
import CustomerLogo from '../components/CustomerLogo'

const CustomersPage = ({ location }) => {
  const { locale, t } = useI18n()

  return (
    <SiteLayout location={location}>

      <main className="main-content customers-content">
        <div className="content-cards customers-cards">
          <div className="card card-primary customers-hero-card">
            <h1 className="customers-page-title">{t('customers.title')}</h1>
            <div className="card-body">
              <p className="mission-text">{t('customers.intro')}</p>
            </div>
          </div>
        </div>

        <div className="customers-grid">
          {customersData.map((customer) => (
            <div key={customer.id} className="card card-secondary customer-card">
              <div className="customer-card-body">
                <div className="customer-logo">
                  <CustomerLogo customerId={customer.id} name={customer.name} />
                </div>
                <h2 className="customer-name">{customer.name}</h2>
                <span className="customer-category">{localizedField(customer, 'category', locale)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="content-cards customers-cards">
          <div className="card card-secondary customers-migration-card">
            <div className="card-body">
              <p className="mission-text">{t('customers.migration')}</p>
            </div>
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}

export default CustomersPage

export const Head = (props) => <PageHead pageKey="customers" {...props} />
