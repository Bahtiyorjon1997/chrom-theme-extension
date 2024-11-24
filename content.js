// Utility functions for contrast and luminance
function getLuminance(color) {
  const rgb = color.match(/\d+/g).map(Number)
  const [r, g, b] = rgb.map((value) => {
    value /= 255
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getContrastRatio(luminance1, luminance2) {
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)
  return (lighter + 0.05) / (darker + 0.05)
}

function getContrastColor(bgColor) {
  const luminance = getLuminance(bgColor)
  return luminance > 0.5 ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'
}

// Apply dynamic hover adjustments
function adjustHoverColors() {
  const elements = document.querySelectorAll('*')

  elements.forEach((element) => {
    // Store the original hover styles
    const computedStyle = getComputedStyle(element)
    const originalBgColor = computedStyle.backgroundColor
    const originalTextColor = computedStyle.color

    // Detect hover state changes
    element.addEventListener('mouseenter', () => {
      const hoverBgColor = window.getComputedStyle(element).backgroundColor
      const hoverTextColor = window.getComputedStyle(element).color

      // Check if contrast ratio is acceptable
      const bgLuminance = getLuminance(hoverBgColor)
      const textLuminance = getLuminance(hoverTextColor)
      const contrastRatio = getContrastRatio(bgLuminance, textLuminance)

      if (contrastRatio < 4.5) {
        const newTextColor = getContrastColor(hoverBgColor)
        element.style.color = newTextColor // Adjust font color dynamically
      }
    })

    element.addEventListener('mouseleave', () => {
      // Restore original styles on mouse leave
      element.style.backgroundColor = originalBgColor
      element.style.color = originalTextColor
    })
  })
}

// Adjust font colors globally
function adjustFontColors() {
  const elements = document.querySelectorAll('*')
  elements.forEach((element) => {
    const computedStyle = getComputedStyle(element)
    const bgColor = computedStyle.backgroundColor
    const textColor = computedStyle.color

    if (bgColor && textColor) {
      const bgLuminance = getLuminance(bgColor)
      const textLuminance = getLuminance(textColor)

      const contrastRatio = getContrastRatio(bgLuminance, textLuminance)

      if (contrastRatio < 4.5) {
        const newColor = getContrastColor(bgColor)
        element.style.color = newColor
      }
    }
  })
}

// Handle theme toggling and hover effects
chrome.runtime.onMessage.addListener((request) => {
  const theme = request.theme

  const darkModeStyles = `
    html, body { background-color: #121212; color: #e0e0e0; }
    a { color: #bb86fc; }
  `

  const lightModeStyles = `
    html, body { background-color: #ffffff; color: #000000; }
    a { color: #1a73e8; }
  `

  const styleElement = document.createElement('style')
  styleElement.id = 'theme-toggle-styles'

  switch (theme) {
    case 'dark':
      styleElement.textContent = darkModeStyles
      break
    case 'light':
      styleElement.textContent = lightModeStyles
      break
    case 'system':
      const isDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      styleElement.textContent = isDarkMode ? darkModeStyles : lightModeStyles
      break
  }

  const existingStyles = document.getElementById('theme-toggle-styles')
  if (existingStyles) {
    existingStyles.remove()
  }
  document.head.appendChild(styleElement)

  // Adjust font and hover colors dynamically
  adjustFontColors()
  adjustHoverColors()
})

// Apply adjustments on page load
window.addEventListener('DOMContentLoaded', () => {
  adjustFontColors()
  adjustHoverColors()
})
