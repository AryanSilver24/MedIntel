import { useState } from 'react'
import Icon from '../components/Icon'
import { Card, CardHead, Badge, Button, PageHead } from '../components/ui'
import { reports } from '../data/mock'

const values = [
  { label: 'Haemoglobin', value: '14.2 g/dL', range: '13.0 – 17.0', ok: true },
  { label: 'WBC count', value: '11.4 ×10⁹/L', range: '4.0 – 11.0', ok: false },
  { label: 'Platelets', value: '265 ×10⁹/L', range: '150 – 410', ok: true },
  { label: 'ESR', value: '18 mm/hr', range: '0 – 22', ok: true },
]

export default function Reports() {
  const [drag, setDrag] = useState(false)

  return (
    <>
      <PageHead
        eyebrow="Module 04"
        title="Medical reports"
        sub="Upload a PDF or image. Extraction runs off the request path on a worker queue, then attaches a plain-language summary to your timeline."
      >
        <Button><Icon name="upload" className="size-4" /> Upload report</Button>
      </PageHead>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr] lg:items-start">
        <div className="space-y-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false) }}
            className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition ${
              drag ? 'border-brand bg-brand-soft' : 'border-[#cfd8e3] bg-white'
            }`}
          >
            <span className="grid size-10 place-items-center rounded-lg bg-surface text-slate ring-1 ring-line">
              <Icon name="upload" className="size-5" />
            </span>
            <p className="mt-4 text-[14px] font-medium text-ink">Drop a report here</p>
            <p className="mt-1 text-[12.5px] text-muted">PDF, JPG or PNG · up to 10 MB</p>
            <Button variant="secondary" size="sm" className="mt-4">Browse files</Button>
          </div>

          <Card>
            <CardHead title="On file" sub={`${reports.length} reports`} />
            <ul className="divide-y divide-line">
              {reports.map((r) => (
                <li key={r.name} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface text-slate ring-1 ring-line">
                    <Icon name="file" className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-ink">{r.name}</p>
                    <p className="text-[12px] text-muted">{r.lab} · {r.date}</p>
                  </div>
                  <Badge tone={r.tone}>{r.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card>
          <CardHead
            title="Complete Blood Count"
            sub="Apollo Diagnostics · 12 Aug 2025"
            action={<Badge tone="amber">1 value flagged</Badge>}
          />

          <div className="p-5">
            <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">
              Extracted values
            </p>
            <div className="overflow-hidden rounded-lg ring-1 ring-line">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-surface text-left text-[11.5px] uppercase tracking-[0.08em] text-muted">
                    <th className="px-4 py-2.5 font-semibold">Marker</th>
                    <th className="px-4 py-2.5 font-semibold">Result</th>
                    <th className="px-4 py-2.5 font-semibold">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {values.map((v) => (
                    <tr key={v.label} className="bg-white">
                      <td className="px-4 py-2.5 text-slate">{v.label}</td>
                      <td className={`px-4 py-2.5 font-medium ${v.ok ? 'text-ink' : 'text-amber'}`}>
                        {v.value}
                        {!v.ok && <span className="ml-1.5 text-[11px] font-semibold">HIGH</span>}
                      </td>
                      <td className="px-4 py-2.5 text-muted">{v.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mb-2 mt-6 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">
              Summary
            </p>
            <p className="text-[13.5px] leading-relaxed text-slate">
              Most markers sit comfortably within the reference range. The white cell count is mildly
              elevated, which is a common finding during or shortly after an infection and is
              consistent with the symptom session recorded on 14 August. It is worth repeating once
              the current illness has resolved so the trend can be compared.
            </p>

            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-line bg-surface p-3.5">
              <Icon name="alert" className="mt-px size-4 shrink-0 text-amber" />
              <p className="text-[12.5px] leading-relaxed text-slate">
                Summaries describe what a report contains. They do not interpret it clinically, and
                they never recommend medication. Discuss flagged values with your physician.
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <Button variant="secondary" size="sm">Download original</Button>
              <Button variant="ghost" size="sm">Add to timeline note</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
