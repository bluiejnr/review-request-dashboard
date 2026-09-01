'use client'

import { useCallback, useEffect, useState } from 'react'

// NOTE: This is a front-end prototype. Sending is simulated and data is kept in
// the browser so the flow feels real. When wiring up a real SMS provider
// (e.g. Twilio) and multi-user accounts, move settings + history to a database.

export type BusinessSettings = {
  businessName: string
  reviewLink: string
  messageTemplate: string
}

export type SentMessage = {
  id: string
  customerName: string
  phone: string
  body: string
  sentAt: number
}

export const DEFAULT_TEMPLATE =
  "Hi {name}, thanks for choosing {business}! We'd love your feedback — could you leave us a quick Google review? {link}"

const SETTINGS_KEY = 'reviewnudge:settings'
const HISTORY_KEY = 'reviewnudge:history'

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'Bright Smile Dental',
  reviewLink: 'https://g.page/r/your-business-review-link',
  messageTemplate: DEFAULT_TEMPLATE,
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function useReviewStore() {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS)
  const [history, setHistory] = useState<SentMessage[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSettings(read(SETTINGS_KEY, DEFAULT_SETTINGS))
    setHistory(read(HISTORY_KEY, []))
    setHydrated(true)
  }, [])

  const saveSettings = useCallback((next: BusinessSettings) => {
    setSettings(next)
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  }, [])

  const addToHistory = useCallback((message: SentMessage) => {
    setHistory((prev) => {
      const next = [message, ...prev].slice(0, 50)
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    window.localStorage.removeItem(HISTORY_KEY)
  }, [])

  return {
    settings,
    history,
    hydrated,
    saveSettings,
    addToHistory,
    clearHistory,
  }
}

export function fillTemplate(
  template: string,
  vars: { name: string; business: string; link: string },
) {
  return template
    .replaceAll('{name}', vars.name || 'there')
    .replaceAll('{business}', vars.business || 'our team')
    .replaceAll('{link}', vars.link || '')
    .trim()
}

export function formatPhone(input: string) {
  const digits = input.replace(/\D/g, '').slice(0, 10)
  const parts = []
  if (digits.length > 0) parts.push('(' + digits.slice(0, 3))
  if (digits.length >= 3) parts.push(') ' + digits.slice(3, 6))
  if (digits.length >= 6) parts.push('-' + digits.slice(6, 10))
  return parts.join('').replace(/\)\s-$/, ')')
}

export function isValidPhone(input: string) {
  return input.replace(/\D/g, '').length === 10
}
