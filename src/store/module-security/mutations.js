export function setIsAuthenticated (state, payload) {
  const isValid = /^[a-f0-9]{40}$/i.test(payload)
  state.isAuthenticated = isValid

  if (isValid) {
    localStorage.setItem('sha-code', payload)
    state.shaCode = payload
  }
}

export function logout (state) {
  localStorage.removeItem('sha-code')
  state.shaCode = null
  state.isAuthenticated = false
}
