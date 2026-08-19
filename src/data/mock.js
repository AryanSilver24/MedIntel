export const user = {
  name: 'Aarav Menon',
  email: 'aarav.menon@example.com',
  initials: 'AM',
  age: 27,
  sex: 'Male',
  allergies: ['Penicillin', 'Dust mites'],
  conditions: ['Mild asthma'],
}

export const nav = [
  { to: '/app', label: 'Overview', icon: 'home', end: true },
  { to: '/app/symptoms', label: 'Symptom analysis', icon: 'pulse' },
  { to: '/app/chat', label: 'Health chat', icon: 'chat' },
  { to: '/app/reports', label: 'Reports', icon: 'file' },
  { to: '/app/reminders', label: 'Reminders', icon: 'clock' },
  { to: '/app/history', label: 'History', icon: 'timeline' },
  { to: '/app/profile', label: 'Profile', icon: 'user' },
]

export const triageResult = {
  urgency: 'Routine',
  tone: 'teal',
  confidence: 0.72,
  redFlags: [],
  conditions: [
    { name: 'Viral upper respiratory infection', likelihood: 0.68, note: 'Consistent with onset, fever pattern and absence of localised pain.' },
    { name: 'Acute bacterial sinusitis', likelihood: 0.21, note: 'Consider if symptoms persist beyond 10 days or worsen after improvement.' },
    { name: 'Seasonal allergic rhinitis', likelihood: 0.11, note: 'History of dust-mite allergy raises baseline probability.' },
  ],
  advice: [
    'Rest and maintain fluid intake for the next 48 hours.',
    'Monitor temperature twice daily and record it in your history.',
    'Seek in-person care if breathing becomes difficult or fever exceeds 39 °C.',
  ],
}

export const redFlagRules = [
  { rule: 'Chest pain + shortness of breath', action: 'Immediate escalation', tone: 'rose' },
  { rule: 'Sudden unilateral weakness', action: 'Immediate escalation', tone: 'rose' },
  { rule: 'Fever > 39 °C for 3+ days', action: 'Urgent review', tone: 'amber' },
]

export const messages = [
  { from: 'bot', text: 'Good morning, Aarav. I have your session from 14 Aug on file — sore throat, mild fever, day three. How are you feeling today?' },
  { from: 'user', text: 'Fever is gone but the cough is still there, mostly at night.' },
  { from: 'bot', text: 'A residual night cough after a viral infection is common and can persist for one to three weeks. Since your fever has resolved, the trend is in the right direction.\n\nTwo things worth watching: any wheeze given your asthma history, and whether the cough starts producing coloured sputum.' },
  { from: 'bot', text: 'This is decision support, not a diagnosis. If the cough wakes you repeatedly or you feel breathless, please see a physician.', meta: true },
]

export const reports = [
  { name: 'Complete Blood Count', lab: 'Apollo Diagnostics', date: '12 Aug 2025', status: 'Summarised', tone: 'teal', flags: 1 },
  { name: 'Lipid Profile', lab: 'Metropolis', date: '02 Jul 2025', status: 'Summarised', tone: 'teal', flags: 0 },
  { name: 'Chest X-Ray', lab: 'City Imaging', date: '28 Jun 2025', status: 'Processing', tone: 'amber', flags: 0 },
]

export const reminders = [
  { drug: 'Montelukast 10 mg', time: '21:00', freq: 'Daily', next: 'Tonight', adherence: 0.94, tone: 'teal' },
  { drug: 'Vitamin D3 60000 IU', time: '09:00', freq: 'Weekly · Sunday', next: 'In 3 days', adherence: 0.8, tone: 'teal' },
  { drug: 'Azithromycin 500 mg', time: '08:00', freq: 'Daily · 3 days left', next: 'Tomorrow', adherence: 0.66, tone: 'amber' },
]

export const timeline = [
  { date: '18 Aug 2025', kind: 'Chat', tone: 'brand', title: 'Follow-up conversation', body: 'Residual night cough reviewed. No escalation triggered.' },
  { date: '14 Aug 2025', kind: 'Triage', tone: 'teal', title: 'Symptom session — sore throat, fever', body: 'Routine urgency. Viral URI ranked highest at 68% confidence.' },
  { date: '12 Aug 2025', kind: 'Report', tone: 'amber', title: 'Complete Blood Count uploaded', body: 'One value outside reference range: WBC 11.4 ×10⁹/L.' },
  { date: '02 Jul 2025', kind: 'Report', tone: 'amber', title: 'Lipid Profile uploaded', body: 'All values within reference range.' },
  { date: '28 Jun 2025', kind: 'Medication', tone: 'brand', title: 'Montelukast schedule created', body: 'Daily 21:00, ongoing. Adherence tracked from this date.' },
]
