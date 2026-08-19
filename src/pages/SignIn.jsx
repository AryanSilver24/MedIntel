import { useNavigate, Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Icon from '../components/Icon'
import { Button, Field, inputCls } from '../components/ui'

export default function SignIn() {
  const navigate = useNavigate()

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link to="/"><Logo /></Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-[27px] font-semibold tracking-[-0.03em] text-ink">Sign in to MedIntel</h1>
          <p className="mt-2 text-[14px] text-slate">
            New here?{' '}
            <Link to="/app" className="font-medium text-brand hover:text-brand-dark">Create an account</Link>
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              navigate('/app')
            }}
          >
            <Field label="Email">
              <input type="email" defaultValue="aarav.menon@example.com" className={inputCls} />
            </Field>

            <Field label="Password">
              <input type="password" defaultValue="password" className={inputCls} />
            </Field>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-[13px] text-slate">
                <input type="checkbox" defaultChecked className="size-3.5 rounded border-line accent-[#635bff]" />
                Keep me signed in
              </label>
              <a href="#reset" className="text-[13px] font-medium text-brand hover:text-brand-dark">
                Forgot password?
              </a>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Continue <Icon name="arrow" className="size-4" />
            </Button>
          </form>

          <p className="mt-6 flex items-start gap-2 rounded-lg bg-surface p-3.5 text-[12.5px] leading-relaxed text-slate ring-1 ring-line">
            <Icon name="shield" className="mt-px size-4 shrink-0 text-teal" />
            Credentials are hashed with bcrypt and sessions are stateless JWTs with short TTL and
            refresh rotation.
          </p>
        </div>

        <p className="text-[12.5px] text-muted">© 2025 MedIntel · Academic project</p>
      </div>

      <div className="hero-wash relative hidden overflow-hidden border-l border-line bg-surface lg:block">
        <div className="absolute inset-0 grid-lines opacity-70" />
        <div className="relative flex h-full items-center justify-center p-14">
          <div className="w-full max-w-md">
            <div className="rounded-xl bg-white p-5 shadow-lift ring-1 ring-line">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-[13px] font-semibold text-ink">Triage pipeline</span>
                <span className="text-[11.5px] font-medium text-muted">7 stages</span>
              </div>
              <ol className="mt-3 space-y-2">
                {[
                  ['Normalise', 'Structured intake'],
                  ['Redact', 'PII stripped at the boundary'],
                  ['Rules', 'Deterministic red-flag check'],
                  ['Context', 'Profile + history injected'],
                  ['Call', 'Provider behind adapter'],
                  ['Validate', 'Schema + banned content'],
                  ['Wrap', 'Confidence · urgency · notice'],
                ].map(([stage, detail], i) => (
                  <li key={stage} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface">
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface text-[11px] font-semibold text-slate ring-1 ring-line">
                      {i + 1}
                    </span>
                    <span className="text-[13px] font-medium text-ink">{stage}</span>
                    <span className="ml-auto text-[12px] text-muted">{detail}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-6 text-[14px] leading-relaxed text-slate">
              “A probabilistic component never sits alone on a safety-critical path.”
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
