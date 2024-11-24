chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ theme: 'system' })
})
