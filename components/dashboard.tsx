'use client'

import { MessageSquareText, Star } from 'lucide-react'
import { useReviewStore } from '@/lib/review-store'
import { SendRequestForm } from '@/components/send-request-form'
import { BusinessSettingsCard } from '@/components/business-settings'
import { ActivityLog } from '@/components/activity-log'

export function Dashboard() {
  const { settings, history, hydrated, saveSettings, addToHistory, clearHistory } =
    useReviewStore()

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <MessageSquareText className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">ReviewNudge</h1>
            <p className="text-sm text-muted-foreground">
              {hydrated ? settings.businessName : '\u00A0'}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-medium shadow-sm"
          aria-label={`${history.length} requests sent`}
        >
          <Star className="size-4 fill-star text-star" aria-hidden="true" />
          <span>{history.length} sent</span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SendRequestForm settings={settings} onSent={addToHistory} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <BusinessSettingsCard settings={settings} onSave={saveSettings} />
          <ActivityLog history={history} onClear={clearHistory} />
        </div>
      </div>
    </div>
  )
}
