import { useState } from 'react'
import Icon from '../components/Icon'
import { Card, CardHead, Badge, Button, Field, inputCls, PageHead } from '../components/ui'
import { triageResult } from '../data/mock'

const symptomOptions = [
  'Sore throat', 'Fever', 'Cough', 'Headache', 'Fatigue', 'Shortness of breath',
  'Chest pain', 'Nausea', 'Dizziness', 'Body ache', 'Runny nose', 'Loss of appetite',
]

const steps = ['Symptoms', 'Details', 'Result']

function Meter({ value, tone = 'brand' }) {
  const bar = { brand: 'bg-brand', teal: 'bg-teal', amber: 'bg-amber', rose: 'bg-rose' }[tone]
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
      <div className={`h-full rounded-full ${bar} transition-[width] duration-500`} style={{ width: `${value * 100}%` }} />
    </div>
  )
}

export default function Symptoms() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(['Sore throat', 'Fever', 'Cough'])
  const [severity, setSeverity] = useState(4)

  const toggle = (s) =>
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  return (
    <>
      <PageHead
        eyebrow="Module 02"
        title="Symptom analysis"
        sub="Structured intake runs through the deterministic rules engine before the AI is called. The result is a ranked list of possibilities — never a diagnosis."
      />

      <div className="mb-6 flex items-center gap-3">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition ${
                i === step ? 'bg-brand-soft text-brand' : i < step ? 'text-ink hover:bg-surface' : 'text-muted'
              }`}
            >
              <span className={`grid size-5 place-items-center rounded-full text-[11px] font-semibold ${
                i <= step ? 'bg-brand text-white' : 'bg-line text-muted'
              }`}>
                {i < step ? <Icon name="check" className="size-3" strokeWidth={3} /> : i + 1}
              </span>
              {s}
            </button>
            {i < steps.length - 1 && <span className="h-px w-6 bg-line sm:w-10" />}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <Card>
          {step === 0 && (
            <>
              <CardHead title="What are you experiencing?" sub="Select everything that applies — you can refine next." />
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {symptomOptions.map((s) => {
                    const on = selected.includes(s)
                    return (
                      <button
                        key={s}
                        onClick={() => toggle(s)}
                        className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
                          on
                            ? 'bg-ink text-white'
                            : 'bg-white text-slate ring-1 ring-line hover:ring-[#cfd8e3]'
                        }`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-5">
                  <Field label="Anything not listed above" hint="Free text is normalised and redacted before it leaves the API layer.">
                    <textarea rows={3} className={inputCls} placeholder="Describe in your own words…" />
                  </Field>
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <CardHead title="A little more context" sub="These fields sharpen the rules engine, not just the prompt." />
              <div className="space-y-5 p-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="How long has this been going on?">
                    <select className={inputCls} defaultValue="3 days">
                      {['Less than a day', '1–2 days', '3 days', 'About a week', 'More than two weeks'].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Highest recorded temperature">
                    <input className={inputCls} defaultValue="38.1 °C" />
                  </Field>
                </div>

                <div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-[13px] font-medium text-slate">Overall severity</span>
                    <span className="text-[13px] font-semibold text-ink">{severity} / 10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    className="w-full accent-[#635bff]"
                  />
                  <div className="mt-1 flex justify-between text-[11.5px] text-muted">
                    <span>Barely noticeable</span><span>Unbearable</span>
                  </div>
                </div>

                <Field label="Is it getting better or worse?">
                  <div className="flex gap-2">
                    {['Improving', 'Stable', 'Worsening'].map((o, i) => (
                      <label key={o} className="flex-1">
                        <input type="radio" name="trend" defaultChecked={i === 1} className="peer sr-only" />
                        <span className="block cursor-pointer rounded-lg py-2 text-center text-[13px] font-medium text-slate ring-1 ring-line transition peer-checked:bg-brand-soft peer-checked:text-brand peer-checked:ring-brand/30">
                          {o}
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <CardHead
                title="Assessment"
                sub="Generated 18 Aug 2025 · session #4821"
                action={<Badge tone={triageResult.tone}>{triageResult.urgency}</Badge>}
              />
              <div className="p-5">
                <div className="flex items-start gap-3 rounded-lg bg-teal-soft p-4">
                  <Icon name="shield" className="mt-0.5 size-[18px] shrink-0 text-teal" />
                  <p className="text-[13px] leading-relaxed text-slate">
                    <span className="font-semibold text-ink">No red flags triggered.</span> The rules
                    engine cleared this session before the AI was called. Urgency is routine —
                    self-care with monitoring.
                  </p>
                </div>

                <p className="mb-3 mt-6 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Ranked possibilities
                </p>
                <ul className="space-y-4">
                  {triageResult.conditions.map((c, i) => (
                    <li key={c.name}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-4">
                        <span className="text-[14px] font-medium text-ink">{c.name}</span>
                        <span className="text-[13px] font-semibold text-slate">
                          {Math.round(c.likelihood * 100)}%
                        </span>
                      </div>
                      <Meter value={c.likelihood} tone={i === 0 ? 'brand' : 'slate'} />
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{c.note}</p>
                    </li>
                  ))}
                </ul>

                <p className="mb-3 mt-7 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Suggested next steps
                </p>
                <ul className="space-y-2.5">
                  {triageResult.advice.map((a) => (
                    <li key={a} className="flex gap-2.5 text-[13.5px] leading-relaxed text-slate">
                      <Icon name="check" className="mt-0.5 size-4 shrink-0 text-teal" strokeWidth={2.2} />
                      {a}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-line bg-surface p-3.5">
                  <Icon name="alert" className="mt-px size-4 shrink-0 text-amber" />
                  <p className="text-[12.5px] leading-relaxed text-slate">
                    This is decision support, not a diagnosis. MedIntel does not prescribe medication
                    and is not an emergency service. Consult a licensed physician.
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between border-t border-line px-5 py-4">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            {step < 2 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                {step === 1 ? 'Run analysis' : 'Continue'} <Icon name="arrow" className="size-4" />
              </Button>
            ) : (
              <Button as="link" to="/app/chat">
                Discuss in chat <Icon name="arrow" className="size-4" />
              </Button>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHead title="Session summary" />
            <dl className="divide-y divide-line text-[13px]">
              {[
                ['Symptoms', selected.length ? `${selected.length} selected` : 'None yet'],
                ['Severity', `${severity} / 10`],
                ['Red flags', '0 matched'],
                ['Confidence', `${Math.round(triageResult.confidence * 100)}%`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-5 py-3">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <CardHead title="Pipeline trace" sub="What the request passed through" />
            <ol className="divide-y divide-line">
              {['Normalise', 'Redact PII', 'Red-flag rules', 'Context assembly', 'Provider call', 'Schema validation', 'Guardrail wrap'].map((s, i) => (
                <li key={s} className="flex items-center gap-3 px-5 py-2.5">
                  <span className={`grid size-5 shrink-0 place-items-center rounded-full text-[10.5px] font-semibold ${
                    step === 2 ? 'bg-teal-soft text-teal' : 'bg-surface text-muted ring-1 ring-line'
                  }`}>
                    {step === 2 ? <Icon name="check" className="size-3" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="text-[13px] text-slate">{s}</span>
                  <span className="ml-auto text-[11.5px] text-muted">
                    {step === 2 ? `${8 + i * 3} ms` : '—'}
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  )
}
