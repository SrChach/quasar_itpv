export function setIsAuthenticated (state, payload) {
  const isValid = /^[a-f0-9]{40}$/i.test(payload)
  state.isAuthenticated = isValid

  if (isValid) {
    localStorage.setItem('sha-code', payload)
    state.shaCode = payload
  }
}

export function setIsActivated (state, payload) {
  const decryptedPayload = atob(payload)
  const isValid = /[a-z]{4}-[a-z]{4}-[a-z]{4}/i.test(decryptedPayload)
  state.isActivated = isValid

  if (isValid) {
    localStorage.setItem('serial-code', payload)
    state.serialCode = payload
  }
}

export function setClientName (state, payload) {
  localStorage.setItem('client-name', payload)
  state.clientName = payload
}

export function logout (state) {
  localStorage.removeItem('sha-code')
  state.shaCode = null
  state.isAuthenticated = false
}
