import { MessageSquareText } from 'lucide-react'

export function MessagePreview({
  body,
  phone,
}: {
  body: string
  phone: string
}) {
  return (
    <div className="rounded-xl border bg-muted/40 p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <MessageSquareText className="size-3.5" aria-hidden="true" />
        <span>Message preview{phone ? ` — to ${phone}` : ''}</span>
      </div>
      <div className="flex justify-start">
        <p className="max-w-[85%] whitespace-pre-wrap text-pretty rounded-2xl rounded-bl-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
          {body}
        </p>
      </div>
    </div>
  )
}
