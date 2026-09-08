import { useState } from 'react'
import Icon from '../../components/Icon'
import { Card, Badge, Button } from '../../components/ui'
import { useApi } from '../../lib/useApi'
import { api } from '../../lib/api'

export default function HospitalsDirectory({ onSelectHospital }) {
  const [city, setCity] = useState('')
  const [department, setDepartment] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const { data, loading, reload } = useApi(
    () => api.hospitals.search({ city, department, name: searchQuery }),
    [city, department, searchQuery]
  )

  const hospitals = data?.hospitals ?? []
  const cities = data?.cities ?? []
  const departments = data?.departments ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-brand-soft via-surface to-white p-5 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospitals or clinics by name..."
            className="h-10 w-full rounded-xl bg-white pl-9 pr-3 text-[13.5px] text-ink ring-1 ring-line transition placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-10 rounded-xl bg-white px-3 text-[13px] font-medium text-slate ring-1 ring-line outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="h-10 rounded-xl bg-white px-3 text-[13px] font-medium text-slate ring-1 ring-line outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[13px] text-muted">Searching nearby hospitals & clinics...</div>
      ) : hospitals.length === 0 ? (
        <div className="py-12 text-center">
          <Icon name="alert" className="mx-auto size-8 text-muted" />
          <p className="mt-2 text-[14px] font-medium text-ink">No hospitals or clinics found</p>
          <p className="mt-0.5 text-[12.5px] text-muted">Try broadening your city or department filter.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((h) => (
            <Card
              key={h.id}
              className="group flex flex-col justify-between transition hover:border-[#cfd8e3] hover:shadow-md"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <Badge tone={h.type === 'Hospital' ? 'brand' : h.type === 'Clinic' ? 'teal' : 'amber'}>
                    {h.type}
                  </Badge>
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-amber">
                    ★ {h.rating}
                  </span>
                </div>

                <h3 className="mt-2 text-[16px] font-semibold text-ink group-hover:text-brand transition">
                  {h.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-slate">
                  <Icon name="location" className="size-3.5 shrink-0 text-muted" />
                  {h.address}, {h.city}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {h.departments.slice(0, 3).map((dept) => (
                    <span
                      key={dept}
                      className="rounded bg-surface px-2 py-0.5 text-[11px] font-medium text-slate ring-1 ring-line"
                    >
                      {dept}
                    </span>
                  ))}
                  {h.departments.length > 3 && (
                    <span className="rounded bg-surface px-2 py-0.5 text-[11px] font-medium text-muted">
                      +{h.departments.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-line bg-surface/50 p-4">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => onSelectHospital(h.id)}
                >
                  View Doctors & Book →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
