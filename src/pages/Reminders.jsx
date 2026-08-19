import { useState } from 'react'
import Icon from '../components/Icon'
import { Card, CardHead, Badge, Button, Field, inputCls, PageHead } from '../components/ui'
import { reminders } from '../data/mock'

const week = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const log = [
  [1, 1, 1, 1, 1, 0, 1],
  [1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 2],
]

export default function Reminders() {
  const [items, setItems] = useState(reminders.map((r) => ({ ...r, on: true })))

  const toggle = (i) =>
    setItems((prev) => prev.map((r, idx) => (idx === i ? { ...r, on: !r.on } : r)))

  return (
    <>
      <PageHead
        eyebrow="Module 05"
        title="Medicine reminders"
        sub="Schedules run as recurring jobs off the request path. Every dose is logged as taken or missed, which is what the adherence figure is built from."
      >
        <Button><Icon name="plus" className="size-4" /> Add schedule</Button>
      </PageHead>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="space-y-6">
          <Card>
            <CardHead title="Active schedules" sub={`${items.filter((i) => i.on).length} of ${items.length} enabled`} />
            <ul className="divide-y divide-line">
              {items.map((r, i) => (
                <li key={r.drug} className="flex items-center gap-4 px-5 py-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface text-slate ring-1 ring-line">
                    <Icon name="clock" className="size-[18px]" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-ink">{r.drug}</p>
                    <p className="mt-0.5 text-[12.5px] text-muted">
                      {r.time} · {r.freq} · next {r.next.toLowerCase()}
                    </p>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className={`text-[13px] font-semibold ${r.tone === 'amber' ? 'text-amber' : 'text-teal'}`}>
                      {Math.round(r.adherence * 100)}%
                    </p>
                    <p className="text-[11.5px] text-muted">adherence</p>
                  </div>

                  <button
                    onClick={() => toggle(i)}
                    role="switch"
                    aria-checked={r.on}
                    aria-label={`Toggle ${r.drug}`}
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${r.on ? 'bg-brand' : 'bg-line'}`}
                  >
                    <span
                      className={`absolute left-0 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
                        r.on ? 'translate-x-[18px]' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="Adherence log" sub="Last four weeks · taken, missed or late" />
            <div className="p-5">
              <div className="flex gap-2">
                <div className="w-7" />
                {week.map((d, i) => (
                  <span key={i} className="flex-1 text-center text-[11px] font-medium text-muted">{d}</span>
                ))}
              </div>
              {log.map((row, r) => (
                <div key={r} className="mt-2 flex items-center gap-2">
                  <span className="w-7 text-[11px] text-muted">W{r + 1}</span>
                  {row.map((v, c) => (
                    <span
                      key={c}
                      title={['Missed', 'Taken', 'Late'][v]}
                      className={`h-7 flex-1 rounded-md ${
                        v === 1 ? 'bg-teal/85' : v === 2 ? 'bg-amber/70' : 'bg-line'
                      }`}
                    />
                  ))}
                </div>
              ))}
              <div className="mt-4 flex items-center gap-4 text-[11.5px] text-muted">
                {[['bg-teal/85', 'Taken'], ['bg-amber/70', 'Late'], ['bg-line', 'Missed']].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className={`size-2.5 rounded-sm ${c}`} /> {l}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHead title="New schedule" sub="Fields only — nothing is dispensed or prescribed" />
            <div className="space-y-4 p-5">
              <Field label="Medication name">
                <input className={inputCls} placeholder="As written on your prescription" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Dose">
                  <input className={inputCls} placeholder="e.g. 10 mg" />
                </Field>
                <Field label="Time">
                  <input type="time" defaultValue="21:00" className={inputCls} />
                </Field>
              </div>
              <Field label="Repeat">
                <select className={inputCls}>
                  {['Daily', 'Twice daily', 'Weekly', 'Every other day', 'Custom'].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Notify by" hint="Delivery is queued, not sent inline with the request.">
                <div className="flex gap-2">
                  {['Push', 'E-mail', 'Both'].map((o, i) => (
                    <label key={o} className="flex-1">
                      <input type="radio" name="notify" defaultChecked={i === 2} className="peer sr-only" />
                      <span className="block cursor-pointer rounded-lg py-2 text-center text-[13px] font-medium text-slate ring-1 ring-line transition peer-checked:bg-brand-soft peer-checked:text-brand peer-checked:ring-brand/30">
                        {o}
                      </span>
                    </label>
                  ))}
                </div>
              </Field>
              <Button className="w-full">Create schedule</Button>
            </div>
          </Card>

          <Card>
            <CardHead title="Next 24 hours" />
            <ul className="divide-y divide-line">
              {[['21:00', 'Montelukast 10 mg', 'Tonight'], ['08:00', 'Azithromycin 500 mg', 'Tomorrow']].map(([t, d, w]) => (
                <li key={d} className="flex items-center gap-3 px-5 py-3">
                  <span className="w-11 text-[12.5px] font-semibold text-ink">{t}</span>
                  <span className="flex-1 truncate text-[13px] text-slate">{d}</span>
                  <Badge tone="slate">{w}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
