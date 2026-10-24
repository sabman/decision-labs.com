import * as React from 'react'

// Header text flips between black and white as it sits over light and dark cards.
export default function useHeaderContrast(headerRef) {
  const [textColor, setTextColor] = React.useState('black')

  React.useEffect(() => {
    const header = headerRef.current
    if (!header) return

    let ticking = false
    const checkBackground = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const headerRect = header.getBoundingClientRect()
        const headerCenterY = headerRect.top + headerRect.height / 2
        const headerCenterX = window.innerWidth / 2
        const elementBelow = document.elementFromPoint(headerCenterX, headerCenterY)

        if (!elementBelow) {
          setTextColor('black')
          ticking = false
          return
        }

        let currentElement = elementBelow
        while (currentElement && currentElement !== document.body) {
          if (currentElement.classList && currentElement.classList.contains('card-primary')) {
            setTextColor('white')
            ticking = false
            return
          }
          if (currentElement.classList && (
            currentElement.classList.contains('card-secondary') ||
            currentElement.classList.contains('page-container')
          )) {
            setTextColor('black')
            ticking = false
            return
          }
          currentElement = currentElement.parentElement
        }

        const bgColor = window.getComputedStyle(elementBelow).backgroundColor
        if (bgColor) {
          const rgb = bgColor.match(/\d+/g)
          if (rgb && rgb.length >= 3) {
            const brightness = (parseInt(rgb[0], 10) + parseInt(rgb[1], 10) + parseInt(rgb[2], 10)) / 3
            setTextColor(brightness < 128 ? 'white' : 'black')
          } else {
            setTextColor('black')
          }
        } else {
          setTextColor('black')
        }
        ticking = false
      })
    }

    checkBackground()
    window.addEventListener('scroll', checkBackground, { passive: true })
    window.addEventListener('resize', checkBackground, { passive: true })

    return () => {
      window.removeEventListener('scroll', checkBackground)
      window.removeEventListener('resize', checkBackground)
    }
  }, [headerRef])

  return textColor
}
