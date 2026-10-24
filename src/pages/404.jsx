import * as React from 'react'
import { Link } from 'gatsby'
import '../styles/global.css'
import SiteLayout from '../components/SiteLayout'

const NotFoundPage = ({ location }) => {
  return (
    <SiteLayout location={location}>
      <main className="main-content">
        <h1>Page not found</h1>
        <Link to="/">Go home</Link>
      </main>
    </SiteLayout>
  )
}

export default NotFoundPage

export const Head = () => <title>Not Found</title>
