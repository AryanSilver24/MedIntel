import { useState, useRef, useEffect } from 'react'
import Icon from '../components/Icon'
import { Card, CardHead, Badge, Button, PageHead } from '../components/ui'
import { messages as seed, user } from '../data/mock'

const suggestions = [
  'Should I be worried about the night cough?',
  'How does my asthma change this?',
  'When should I see a doctor in person?',
]

export default function Chat() {
  const [messages, setMessages] = useState(seed)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typing])

  const send = (text) => {
    const body = (text ?? draft).trim()
    if (!body) return
    setMessages((m) => [...m, { from: 'user', text: body }])
    setDraft('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [
        ...m,
        {
          from: 'bot',
          text: 'I have logged that against your 14 Aug session. Nothing you describe matches a red-flag pattern, so this stays at routine urgency.\n\nKeep monitoring for wheeze or breathlessness — with your asthma history those are the signals that would change the assessment.',
        },
      ])
    }, 900)
  }

  return (
    <>
      <PageHead
        eyebrow="Module 03"
        title="Health chat"
        sub="Follow-up conversation that carries your session context and stored history into every turn — under the same guardrails as triage."
      />

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-start">
        <Card className="flex h-[calc(100vh-13rem)] max-h-[620px] min-h-[440px] flex-col">
          <CardHead
            title="Session #4821"
            sub="Sore throat, fever · opened 14 Aug"
            action={<Badge tone="teal">Routine</Badge>}
          />

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((m, i) =>
              m.meta ? (
                <div key={i} className="flex items-start gap-2.5 rounded-lg border border-line bg-surface p-3.5">
                  <Icon name="alert" className="mt-px size-4 shrink-0 text-amber" />
                  <p className="text-[12.5px] leading-relaxed text-slate">{m.text}</p>
                </div>
              ) : (
                <div key={i} className={`flex gap-3 ${m.from === 'user' ? 'justify-end' : ''}`}>
                  {m.from === 'bot' && (
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-ink text-white">
                      <Icon name="spark" className="size-3.5" />
                    </span>
                  )}
                  <div
                    className={`max-w-[78%] whitespace-pre-line rounded-xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                      m.from === 'user'
                        ? 'bg-brand text-white'
                        : 'bg-surface text-slate ring-1 ring-line'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.from === 'user' && (
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-surface text-[10.5px] font-semibold text-slate ring-1 ring-line">
                      {user.initials}
                    </span>
                  )}
                </div>
              )
            )}

            {typing && (
              <div className="flex gap-3">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-ink text-white">
                  <Icon name="spark" className="size-3.5" />
                </span>
                <div className="flex items-center gap-1 rounded-xl bg-surface px-4 py-3 ring-1 ring-line">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 animate-bounce rounded-full bg-muted"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-line p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] font-medium text-slate ring-1 ring-line transition hover:text-ink hover:ring-[#cfd8e3]"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send() }}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 ring-1 ring-line focus-within:ring-2 focus-within:ring-brand"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask a follow-up question…"
                className="h-8 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-muted"
              />
              <Button type="submit" size="sm" disabled={!draft.trim()}>
                <Icon name="send" className="size-3.5" /> Send
              </Button>
            </form>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHead title="Context in this conversation" sub="What the model was given" />
            <ul className="divide-y divide-line">
              {[
                ['Profile', 'Age 27 · male · mild asthma'],
                ['Allergies', 'Penicillin, dust mites'],
                ['Last session', '14 Aug · viral URI, 68%'],
                ['Recent report', 'CBC · 1 value out of range'],
              ].map(([k, v]) => (
                <li key={k} className="px-5 py-3">
                  <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted">{k}</p>
                  <p className="mt-0.5 text-[13px] text-ink">{v}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="Applied guardrails" />
            <ul className="space-y-3 p-5">
              {[
                'PII redacted before the provider boundary',
                'Response schema-validated on return',
                'No drug names or dosages permitted',
                'Red-flag rules re-run on every turn',
              ].map((t) => (
                <li key={t} className="flex gap-2.5 text-[13px] leading-relaxed text-slate">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-teal" strokeWidth={2.2} />
                  {t}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
