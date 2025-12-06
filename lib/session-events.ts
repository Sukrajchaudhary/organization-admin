type SessionEventCallback = () => void

class SessionEventEmitter {
  private listeners: SessionEventCallback[] = []

  subscribe(callback: SessionEventCallback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  emit() {
    this.listeners.forEach(callback => callback())
  }
}

export const sessionExpiredEmitter = new SessionEventEmitter()