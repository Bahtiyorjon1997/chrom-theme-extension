document.getElementById('dark').addEventListener('click', () => {
  chrome.storage.local.set({ theme: 'dark' })
  applyTheme('dark')
})

document.getElementById('light').addEventListener('click', () => {
  chrome.storage.local.set({ theme: 'light' })
  applyTheme('light')
})

document.getElementById('system').addEventListener('click', () => {
  chrome.storage.local.set({ theme: 'system' })
  applyTheme('system')
})

function applyTheme(theme) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { theme })
  })
}
