import { useState } from 'react'
import Icon from '../components/Icon'
import { Card, CardHead, Badge, Button, PageHead, Empty } from '../components/ui'
import { timeline } from '../data/mock'

const filters = ['All', 'Triage', 'Chat', 'Report', 'Medication']

export default function History() {
  const [filter, setFilter] = useState('All')
  const shown = filter === 'All' ? timeline : timeline.filter((t) => t.kind === filter)

  return (
    <>
      <PageHead
        eyebrow="Module 06"
        title="Medical history"
        sub="One chronological record of every session, report and medication change — assembled for a real consultation, not for legal or insurance use."
      >
        <Button variant="secondary">Export as PDF</Button>
      </PageHead>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
              filter === f ? 'bg-ink text-white' : 'bg-white text-slate ring-1 ring-line hover:ring-[#cfd8e3]'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-[12.5px] text-muted">{shown.length} entries</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-start">
        <Card className="overflow-hidden">
          {shown.length === 0 ? (
            <Empty
              title="Nothing recorded yet"
              sub="Entries appear here as you complete sessions, upload reports or change medication."
              action={<Button as="link" to="/app/symptoms" size="sm">Start a session</Button>}
            />
          ) : (
            <ol className="relative px-5 py-5">
              <span className="absolute left-[38px] top-8 bottom-8 w-px bg-line" />
              {shown.map((t) => (
                <li key={t.title} className="relative flex gap-4 pb-6 last:pb-0">
                  <span className="relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white ring-1 ring-line">
                    <span className={`size-2 rounded-full ${
                      { brand: 'bg-brand', teal: 'bg-teal', amber: 'bg-amber', rose: 'bg-rose' }[t.tone]
                    }`} />
                  </span>
                  <div className="min-w-0 flex-1 rounded-lg border border-line p-4 transition hover:border-[#cfd8e3]">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={t.tone}>{t.kind}</Badge>
                      <span className="text-[12px] text-muted">{t.date}</span>
                    </div>
                    <p className="mt-2 text-[14px] font-medium text-ink">{t.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate">{t.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHead title="At a glance" sub="Rolling 12 months" />
            <dl className="divide-y divide-line text-[13px]">
              {[
                ['Symptom sessions', '7'],
                ['Escalations triggered', '0'],
                ['Reports uploaded', '3'],
                ['Medication changes', '4'],
                ['Average adherence', '87%'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-5 py-3">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <CardHead title="Export" sub="What a physician receives" />
            <ul className="space-y-3 p-5">
              {[
                'Chronological session and report list',
                'Profile: age, sex, allergies, conditions',
                'Current medication and adherence figures',
                'Every AI output marked as decision support',
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
