'use client'

import { useMemo, useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MessagePreview } from '@/components/message-preview'
import {
  fillTemplate,
  formatPhone,
  isValidPhone,
  type BusinessSettings,
  type SentMessage,
} from '@/lib/review-store'

export function SendRequestForm({
  settings,
  onSent,
}: {
  settings: BusinessSettings
  onSent: (message: SentMessage) => void
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [body, setBody] = useState('')
  const [touchedBody, setTouchedBody] = useState(false)
  const [sending, setSending] = useState(false)

  const resolvedBody = useMemo(() => {
    if (touchedBody) return body
    return fillTemplate(settings.messageTemplate, {
      name,
      business: settings.businessName,
      link: settings.reviewLink,
    })
  }, [touchedBody, body, settings, name])

  const linkMissing = settings.reviewLink.trim().length === 0
  const canSend = name.trim() && isValidPhone(phone) && !linkMissing && !sending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSend) return
    setSending(true)
    // Simulate sending an SMS through a provider.
    await new Promise((r) => setTimeout(r, 1100))
    const message: SentMessage = {
      id: crypto.randomUUID(),
      customerName: name.trim(),
      phone,
      body: resolvedBody,
      sentAt: Date.now(),
    }
    onSent(message)
    toast.success(`Review request sent to ${name.trim()}`, {
      description: `A text was delivered to ${phone} (simulated).`,
    })
    setName('')
    setPhone('')
    setBody('')
    setTouchedBody(false)
    setSending(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send a review request</CardTitle>
        <CardDescription>
          Enter your customer&apos;s details and we&apos;ll text them your
          Google review link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer-name">Customer name</Label>
              <Input
                id="customer-name"
                placeholder="Jane Cooper"
                value={name}
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="customer-phone">Phone number</Label>
              <Input
                id="customer-phone"
                inputMode="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                aria-invalid={phone.length > 0 && !isValidPhone(phone)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message-body">Message</Label>
              {touchedBody && (
                <button
                  type="button"
                  onClick={() => {
                    setTouchedBody(false)
                    setBody('')
                  }}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Reset to template
                </button>
              )}
            </div>
            <Textarea
              id="message-body"
              rows={4}
              value={resolvedBody}
              onChange={(e) => {
                setTouchedBody(true)
                setBody(e.target.value)
              }}
              className="resize-none leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">
              Prefilled from your saved template. Edit freely before sending.
            </p>
          </div>

          <MessagePreview body={resolvedBody} phone={phone} />

          {linkMissing && (
            <p className="text-sm text-destructive">
              Add your Google review link in settings before sending.
            </p>
          )}

          <Button type="submit" disabled={!canSend} className="w-full sm:w-auto">
            {sending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                <Send className="size-4" aria-hidden="true" />
                Send review request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
