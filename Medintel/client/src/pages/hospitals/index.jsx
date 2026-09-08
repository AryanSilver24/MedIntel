import { useState } from 'react'
import { PageHead } from '../../components/ui'
import { useAuth } from '../../lib/auth'
import HospitalsDirectory from './HospitalsDirectory'
import HospitalDetail from './HospitalDetail'
import MyAppointments from './MyAppointments'
import HospitalPortal from './HospitalPortal'

export default function HospitalsModule() {
  const { user } = useAuth()
  const isHospitalRole = user?.role === 'hospital'

  const [activeTab, setActiveTab] = useState(isHospitalRole ? 'portal' : 'directory')
  const [selectedHospitalId, setSelectedHospitalId] = useState(null)

  return (
    <>
      <PageHead
        eyebrow="Module 07"
        title="Nearby Hospitals, Clinics & Appointments"
        sub="Browse medical facilities by city or department, view doctor qualifications, register for donation drives, and book appointments directly."
      />

      <div className="space-y-6">
        <div className="flex border-b border-line">
          <button
            onClick={() => {
              setSelectedHospitalId(null)
              setActiveTab('directory')
            }}
            className={`border-b-2 px-4 py-3 text-[13.5px] font-semibold transition ${
              activeTab === 'directory' && !selectedHospitalId
                ? 'border-brand text-brand'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            🏥 Nearby Hospitals & Clinics
          </button>

          <button
            onClick={() => {
              setSelectedHospitalId(null)
              setActiveTab('appointments')
            }}
            className={`border-b-2 px-4 py-3 text-[13.5px] font-semibold transition ${
              activeTab === 'appointments'
                ? 'border-brand text-brand'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            🗓️ My Appointments
          </button>

          <button
            onClick={() => {
              setSelectedHospitalId(null)
              setActiveTab('portal')
            }}
            className={`border-b-2 px-4 py-3 text-[13.5px] font-semibold transition ${
              activeTab === 'portal'
                ? 'border-brand text-brand'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            👨‍⚕️ Hospital Portal {isHospitalRole && '(Admin)'}
          </button>
        </div>

        {selectedHospitalId ? (
          <HospitalDetail
            hospitalId={selectedHospitalId}
            onBack={() => setSelectedHospitalId(null)}
            onBookedSuccess={() => {
              setSelectedHospitalId(null)
              setActiveTab('appointments')
            }}
          />
        ) : activeTab === 'directory' ? (
          <HospitalsDirectory onSelectHospital={(id) => setSelectedHospitalId(id)} />
        ) : activeTab === 'appointments' ? (
          <MyAppointments />
        ) : (
          <HospitalPortal />
        )}
      </div>
    </>
  )
}
