'use client'

import { useEffect, useState } from 'react'
import { Check, Settings2 } from 'lucide-react'
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
import { DEFAULT_TEMPLATE, type BusinessSettings } from '@/lib/review-store'

export function BusinessSettingsCard({
  settings,
  onSave,
}: {
  settings: BusinessSettings
  onSave: (next: BusinessSettings) => void
}) {
  const [draft, setDraft] = useState(settings)

  useEffect(() => {
    setDraft(settings)
  }, [settings])

  const dirty =
    draft.businessName !== settings.businessName ||
    draft.reviewLink !== settings.reviewLink ||
    draft.messageTemplate !== settings.messageTemplate

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      businessName: draft.businessName.trim(),
      reviewLink: draft.reviewLink.trim(),
      messageTemplate: draft.messageTemplate.trim() || DEFAULT_TEMPLATE,
    })
    toast.success('Business settings saved')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="size-4 text-muted-foreground" aria-hidden="true" />
          Business settings
        </CardTitle>
        <CardDescription>
          Set your review link once — it&apos;s used for every message you send.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="business-name">Business name</Label>
            <Input
              id="business-name"
              value={draft.businessName}
              onChange={(e) =>
                setDraft((d) => ({ ...d, businessName: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="review-link">Google review link</Label>
            <Input
              id="review-link"
              type="url"
              placeholder="https://g.page/r/..."
              value={draft.reviewLink}
              onChange={(e) =>
                setDraft((d) => ({ ...d, reviewLink: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="template">Default message template</Label>
            <Textarea
              id="template"
              rows={4}
              value={draft.messageTemplate}
              onChange={(e) =>
                setDraft((d) => ({ ...d, messageTemplate: e.target.value }))
              }
              className="resize-none leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">
              Use{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.7rem]">
                {'{name}'}
              </code>
              ,{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.7rem]">
                {'{business}'}
              </code>{' '}
              and{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.7rem]">
                {'{link}'}
              </code>{' '}
              as placeholders.
            </p>
          </div>

          <Button type="submit" variant="secondary" disabled={!dirty}>
            <Check className="size-4" aria-hidden="true" />
            {dirty ? 'Save changes' : 'Saved'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
