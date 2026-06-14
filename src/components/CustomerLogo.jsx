import * as React from 'react'
import { customerLogos, logoModifiers } from '../data/customer-logos'

const CustomerLogo = ({ customerId, name }) => {
  const logo = customerLogos[customerId]
  const modifier = logoModifiers[customerId] || ''

  if (!logo) {
    return <span className="customer-logo-fallback">{name}</span>
  }

  const className = `customer-logo-image ${modifier}`.trim()

  if (logo.webp) {
    return (
      <picture>
        <source srcSet={logo.webp} type="image/webp" />
        <img
          src={logo.fallback}
          alt={`${name} logo`}
          className={className}
          width={logo.width}
          height={logo.height}
          loading="lazy"
          decoding="async"
        />
      </picture>
    )
  }

  return (
    <img
      src={logo.src}
      alt={`${name} logo`}
      className={className}
      width={logo.width}
      height={logo.height}
      loading="lazy"
      decoding="async"
    />
  )
}

export default CustomerLogo
