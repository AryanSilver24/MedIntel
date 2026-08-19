import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { Card, CardHead, Badge, Button, PageHead } from '../components/ui'
import { user, timeline, reminders, redFlagRules } from '../data/mock'

const stats = [
  { label: 'Open symptom sessions', value: '1', delta: 'Last updated 4 hours ago' },
  { label: 'Reports on file', value: '3', delta: '1 processing' },
  { label: 'Active medication', value: '3', delta: '2 daily · 1 weekly' },
  { label: '30-day adherence', value: '87%', delta: '+4 pts vs last month' },
]

const shortcuts = [
  { to: '/app/symptoms', icon: 'pulse', title: 'Start a symptom session', body: 'Structured intake, rules first, AI second.' },
  { to: '/app/chat', icon: 'chat', title: 'Ask a follow-up', body: 'Context-aware chat over your history.' },
  { to: '/app/reports', icon: 'upload', title: 'Upload a report', body: 'PDF or image — OCR runs in the background.' },
]

export default function Dashboard() {
  return (
    <>
      <PageHead
        eyebrow="Overview"
        title={`Good morning, ${user.name.split(' ')[0]}.`}
        sub="Nothing on your record requires urgent attention. Your last session is trending toward resolution."
      >
        <Button as="link" to="/app/symptoms">
          <Icon name="plus" className="size-4" /> New session
        </Button>
      </PageHead>

      <div className="grid gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white px-5 py-4">
            <p className="text-[12.5px] font-medium text-muted">{s.label}</p>
            <p className="mt-1.5 text-[26px] font-semibold tracking-[-0.03em] text-ink">{s.value}</p>
            <p className="mt-0.5 text-[12px] text-muted">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHead
            title="Recent activity"
            sub="Sessions, reports and medication in one timeline"
            action={<Link to="/app/history" className="text-[13px] font-medium text-brand hover:text-brand-dark">View all</Link>}
          />
          <ul className="divide-y divide-line">
            {timeline.slice(0, 4).map((t) => (
              <li key={t.title} className="flex gap-4 px-5 py-4 transition-colors hover:bg-surface">
                <Badge tone={t.tone} className="mt-0.5 shrink-0">{t.kind}</Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium text-ink">{t.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-slate">{t.body}</p>
                </div>
                <span className="shrink-0 text-[12px] text-muted">{t.date}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHead title="Today" sub="Doses scheduled for the next 24 hours" />
            <ul className="divide-y divide-line">
              {reminders.slice(0, 2).map((r) => (
                <li key={r.drug} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface text-slate ring-1 ring-line">
                    <Icon name="clock" className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-ink">{r.drug}</p>
                    <p className="text-[12px] text-muted">{r.time} · {r.next}</p>
                  </div>
                  <Button size="sm" variant="secondary">Mark taken</Button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="Red-flag rules" sub="Evaluated before any AI call" />
            <ul className="divide-y divide-line">
              {redFlagRules.map((r) => (
                <li key={r.rule} className="px-5 py-3.5">
                  <p className="text-[13px] font-medium text-ink">{r.rule}</p>
                  <p className={`mt-1 text-[12px] font-medium ${r.tone === 'rose' ? 'text-rose' : 'text-amber'}`}>
                    → {r.action}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line sm:grid-cols-3">
        {shortcuts.map((s) => (
          <Link key={s.to} to={s.to} className="group bg-white px-5 py-5 transition-colors hover:bg-surface">
            <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand">
              <Icon name={s.icon} className="size-[18px]" />
            </span>
            <p className="mt-3.5 flex items-center gap-1.5 text-[14px] font-semibold text-ink">
              {s.title}
              <Icon name="arrow" className="size-3.5 text-muted transition-transform group-hover:translate-x-0.5" />
            </p>
            <p className="mt-1 text-[13px] text-slate">{s.body}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
