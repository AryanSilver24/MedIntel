import Icon from '../components/Icon'
import { Card, CardHead, Badge, Button, Field, inputCls, PageHead } from '../components/ui'
import { user } from '../data/mock'

export default function Profile() {
  return (
    <>
      <PageHead
        eyebrow="Module 01"
        title="Profile & account"
        sub="Everything here is injected as context before the AI is called, and every field is redacted at the provider boundary."
      >
        <Button>Save changes</Button>
      </PageHead>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-6">
          <Card>
            <CardHead title="Personal details" />
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-full bg-ink text-[16px] font-semibold text-white">
                  {user.initials}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{user.name}</p>
                  <p className="text-[13px] text-muted">{user.email}</p>
                </div>
                <Button variant="secondary" size="sm" className="ml-auto">Change photo</Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <input className={inputCls} defaultValue={user.name} />
                </Field>
                <Field label="Email">
                  <input className={inputCls} defaultValue={user.email} />
                </Field>
                <Field label="Age">
                  <input className={inputCls} defaultValue={user.age} />
                </Field>
                <Field label="Sex">
                  <select className={inputCls} defaultValue={user.sex}>
                    {['Male', 'Female', 'Other', 'Prefer not to say'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead title="Clinical background" sub="Raises or lowers baseline probability during triage" />
            <div className="space-y-5 p-5">
              <div>
                <p className="mb-2 text-[13px] font-medium text-slate">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {user.allergies.map((a) => (
                    <Badge key={a} tone="rose">{a}</Badge>
                  ))}
                  <button className="rounded-md px-2 py-0.5 text-[11.5px] font-semibold text-brand ring-1 ring-line hover:bg-brand-soft">
                    + Add
                  </button>
                </div>
              </div>
              <div>
                <p className="mb-2 text-[13px] font-medium text-slate">Chronic conditions</p>
                <div className="flex flex-wrap gap-2">
                  {user.conditions.map((c) => (
                    <Badge key={c} tone="amber">{c}</Badge>
                  ))}
                  <button className="rounded-md px-2 py-0.5 text-[11.5px] font-semibold text-brand ring-1 ring-line hover:bg-brand-soft">
                    + Add
                  </button>
                </div>
              </div>
              <Field label="Notes for the clinician" hint="Free text is normalised and redacted before it leaves the API layer.">
                <textarea rows={3} className={inputCls} defaultValue="Inhaler used seasonally, roughly twice a year." />
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHead title="Security" />
            <ul className="divide-y divide-line">
              {[
                ['Password', 'Updated 3 months ago', 'Change'],
                ['Two-factor auth', 'Not enabled', 'Enable'],
                ['Active sessions', '2 devices', 'Review'],
              ].map(([k, v, a]) => (
                <li key={k} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-ink">{k}</p>
                    <p className="text-[12px] text-muted">{v}</p>
                  </div>
                  <Button variant="secondary" size="sm">{a}</Button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="Data & privacy" />
            <ul className="space-y-3 p-5">
              {[
                'Identifiers stripped before any AI request',
                'Encrypted in transit and at rest',
                'Per-resource ownership checks on every read',
                'Append-only audit log of access',
              ].map((t) => (
                <li key={t} className="flex gap-2.5 text-[13px] leading-relaxed text-slate">
                  <Icon name="shield" className="mt-0.5 size-4 shrink-0 text-teal" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 py-4">
              <button className="text-[13px] font-medium text-rose hover:underline">
                Delete account and all records
              </button>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
