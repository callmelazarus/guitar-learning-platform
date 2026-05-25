const KEY = 'guitarApp'

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function isStorageAvailable() {
  try {
    localStorage.setItem('__test__', '1')
    localStorage.removeItem('__test__')
    return true
  } catch {
    return false
  }
}
