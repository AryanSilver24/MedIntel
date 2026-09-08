/**
 * Seeds a demo account matching the mock data the frontend was designed against, so the
 * UI can be demonstrated without clicking through every flow first.
 *
 *   npm run seed
 *
 * Safe to re-run: the demo user is deleted and recreated.
 */
import bcrypt from 'bcryptjs'
import { connectDatabase, disconnectDatabase } from '../src/data/db.js'
import { initCache } from '../src/data/cache/index.js'
import { User, TriageSession, Conversation, Report, Reminder, TimelineEvent } from '../src/data/models/index.js'
import { logger } from '../src/shared/logger.js'

const DEMO_EMAIL = 'aarav.menon@example.com'
const DEMO_PASSWORD = 'MedIntel2025!'

const daysAgo = (n) => new Date(Date.now() - n * 86400000)

async function seed() {
  await connectDatabase()
  await initCache()

  const existing = await User.findOne({ email: DEMO_EMAIL })
  if (existing) {
    await Promise.all([
      TriageSession.deleteMany({ userId: existing._id }),
      Conversation.deleteMany({ userId: existing._id }),
      Report.deleteMany({ userId: existing._id }),
      Reminder.deleteMany({ userId: existing._id }),
      TimelineEvent.deleteMany({ userId: existing._id }),
      User.deleteOne({ _id: existing._id }),
    ])
    logger.info('cleared existing demo account')
  }

  const user = await User.create({
    name: 'Aarav Menon',
    email: DEMO_EMAIL,
    passwordHash: await bcrypt.hash(DEMO_PASSWORD, 10),
    profile: { age: 27, sex: 'Male', allergies: ['Penicillin', 'Dust mites'], conditions: ['Mild asthma'] },
  })

  const triage = await TriageSession.create({
    userId: user._id,
    input: { text: 'Sore throat and mild fever, day three.', durationDays: 3, symptoms: ['sore_throat', 'fever'] },
    urgency: 'Routine',
    tone: 'teal',
    confidence: 0.72,
    redFlags: [],
    conditions: [
      {
        name: 'Viral upper respiratory infection',
        likelihood: 0.68,
        note: 'Consistent with onset, fever pattern and absence of localised pain.',
      },
      {
        name: 'Acute bacterial sinusitis',
        likelihood: 0.21,
        note: 'Consider if symptoms persist beyond 10 days or worsen after improvement.',
      },
      {
        name: 'Seasonal allergic rhinitis',
        likelihood: 0.11,
        note: 'History of dust-mite allergy raises baseline probability.',
      },
    ],
    advice: [
      'Rest and maintain fluid intake for the next 48 hours.',
      'Monitor temperature twice daily and record it in your history.',
      'Seek in-person care if breathing becomes difficult or fever exceeds 39 °C.',
    ],
    disclaimer: 'This is clinical decision support, not a diagnosis. It does not replace assessment by a qualified clinician.',
    decidedBy: 'ai-assisted',
    aiProvider: 'seed',
    createdAt: daysAgo(5),
  })

  const convo = await Conversation.create({
    userId: user._id,
    title: 'Follow-up conversation',
    lastMessageAt: daysAgo(1),
    messages: [
      { from: 'bot', text: 'Good morning, Aarav. I have your session from 14 Aug on file — sore throat, mild fever, day three. How are you feeling today?' },
      { from: 'user', text: 'Fever is gone but the cough is still there, mostly at night.' },
      { from: 'bot', text: 'A residual night cough after a viral infection is common and can persist for one to three weeks. Since your fever has resolved, the trend is in the right direction.\n\nTwo things worth watching: any wheeze given your asthma history, and whether the cough starts producing coloured sputum.', provider: 'seed' },
      { from: 'bot', text: 'This is clinical decision support, not a diagnosis. It does not replace assessment by a qualified clinician.', meta: true },
    ],
  })

  const reports = await Report.insertMany([
    {
      userId: user._id,
      name: 'Complete Blood Count',
      lab: 'Apollo Diagnostics',
      reportDate: daysAgo(7),
      status: 'Summarised',
      tone: 'amber',
      summary: 'Most values are within their reference ranges. One white-cell measurement sits slightly above the upper limit, which commonly accompanies a recent infection.',
      findings: [
        { label: 'Haemoglobin', value: '13.8', unit: 'g/dL', referenceRange: '13.0 - 17.0', flagged: false },
        { label: 'WBC', value: '11.4', unit: 'x10^9/L', referenceRange: '4.0 - 11.0', flagged: true },
        { label: 'Platelets', value: '250', unit: 'x10^9/L', referenceRange: '150 - 410', flagged: false },
      ],
      flags: 1,
    },
    {
      userId: user._id,
      name: 'Lipid Profile',
      lab: 'Metropolis',
      reportDate: daysAgo(48),
      status: 'Summarised',
      tone: 'teal',
      summary: 'All measured values fall within their reference ranges.',
      findings: [{ label: 'Total cholesterol', value: '168', unit: 'mg/dL', referenceRange: '< 200', flagged: false }],
      flags: 0,
    },
  ])

  const reminder = await Reminder.create({
    userId: user._id,
    drug: 'Montelukast',
    dosage: '10 mg',
    time: '21:00',
    frequency: 'daily',
    startDate: daysAgo(52),
    doses: Array.from({ length: 10 }, (_, i) => ({
      scheduledFor: daysAgo(10 - i),
      status: i === 3 ? 'missed' : 'taken',
    })),
  })

  await Reminder.create({
    userId: user._id,
    drug: 'Vitamin D3',
    dosage: '60000 IU',
    time: '09:00',
    frequency: 'weekly',
    daysOfWeek: [0],
    startDate: daysAgo(30),
    doses: Array.from({ length: 5 }, (_, i) => ({
      scheduledFor: daysAgo(28 - i * 7),
      status: i === 1 ? 'missed' : 'taken',
    })),
  })

  await TimelineEvent.insertMany([
    { userId: user._id, kind: 'Account', tone: 'brand', title: 'Account created', body: 'Your MedIntel health record starts here.', occurredAt: daysAgo(52) },
    { userId: user._id, kind: 'Medication', tone: 'brand', title: 'Montelukast schedule created', body: 'Daily 21:00, ongoing. Adherence tracked from this date.', occurredAt: daysAgo(52), sourceId: reminder._id },
    { userId: user._id, kind: 'Report', tone: 'teal', title: 'Lipid Profile uploaded', body: 'All values within reference range.', occurredAt: daysAgo(48), sourceId: reports[1]._id },
    { userId: user._id, kind: 'Report', tone: 'amber', title: 'Complete Blood Count uploaded', body: 'One value outside reference range: WBC 11.4 x10^9/L.', occurredAt: daysAgo(7), sourceId: reports[0]._id },
    { userId: user._id, kind: 'Triage', tone: 'teal', title: 'Symptom session — sore throat, fever', body: 'Routine urgency. Viral URI ranked highest at 68%.', occurredAt: daysAgo(5), sourceId: triage._id },
    { userId: user._id, kind: 'Chat', tone: 'brand', title: 'Follow-up conversation', body: 'Residual night cough reviewed. No escalation triggered.', occurredAt: daysAgo(1), sourceId: convo._id },
  ])

  console.log('\n  Demo account seeded')
  console.log(`     email:    ${DEMO_EMAIL}`)
  console.log(`     password: ${DEMO_PASSWORD}\n`)

  await disconnectDatabase()
  process.exit(0)
}

seed().catch((err) => {
  logger.error('seed failed', { err: err.message, stack: err.stack })
  process.exit(1)
})
