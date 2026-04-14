import * as React from 'react'
import { Link } from 'gatsby'
import '../styles/global.css'
import Footer from '../components/Footer'

const NotFoundPage = () => {
  return (
    <div className="page-container">
      <main className="main-content">
        <h1>Page not found</h1>
        <Link to="/">Go home</Link>
      </main>
      <Footer />
    </div>
  )
}

export default NotFoundPage

export const Head = () => <title>Not Found</title>

