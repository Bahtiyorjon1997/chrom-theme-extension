chrome.runtime.onMessage.addListener((request) => {
  const theme = request.theme
  const darkModeStyles = `
    html, body { background-color: #171414; color: #e0e0e0; }
    a { color: #bb86fc; }
  `

  const lightModeStyles = `
    html, body { background-color: #ffffff; color: #171414; }
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
})
