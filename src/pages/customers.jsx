import * as React from 'react'
import '../styles/global.css'
import SiteLayout from '../components/SiteLayout'
import customersData from '../data/customers.json'
import CustomerLogo from '../components/CustomerLogo'

const CustomersPage = ({ location }) => {


  return (
    <SiteLayout location={location}>

      <main className="main-content customers-content">
        <div className="content-cards customers-cards">
          <div className="card card-primary customers-hero-card">
            <h1 className="customers-page-title">Customers</h1>
            <div className="card-body">
              <p className="mission-text">
                We work with leading organizations across finance, government, space, and technology — from custom AI products to geospatial infrastructure on Geobase.
              </p>
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
                <span className="customer-category">{customer.category}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="content-cards customers-cards">
          <div className="card card-secondary customers-migration-card">
            <div className="card-body">
              <p className="mission-text">
                Many teams have moved from CartoDB to Geobase for Postgres-native geospatial infrastructure — lower cost, full data ownership, and modern AI workflows.
              </p>
            </div>
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}

export default CustomersPage

export const Head = () => <title>Customers - Decision Labs</title>
