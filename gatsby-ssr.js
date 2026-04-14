import React from 'react'
import ContourBackground from './src/components/ContourBackground'

export const wrapPageElement = ({ element }) => {
  return (
    <>
      <ContourBackground />
      {element}
    </>
  )
}
