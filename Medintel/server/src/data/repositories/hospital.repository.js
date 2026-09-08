import { Hospital } from '../models/Hospital.js'

export const hospitalRepository = {
  async findByUserId(userId) {
    return Hospital.findOne({ userId })
  },

  async findById(id) {
    return Hospital.findById(id)
  },

  async create(data) {
    return Hospital.create(data)
  },

  async update(id, updates) {
    return Hospital.findByIdAndUpdate(id, { $set: updates }, { new: true })
  },

  async search({ city, department, name, limit = 20, skip = 0 }) {
    const query = {}
    if (city) query.city = new RegExp(city, 'i')
    if (department) query.departments = new RegExp(department, 'i')
    if (name) query.name = new RegExp(name, 'i')

    const [items, total] = await Promise.all([
      Hospital.find(query).sort({ rating: -1, createdAt: -1 }).limit(limit).skip(skip),
      Hospital.countDocuments(query),
    ])

    return { items, total }
  },

  async listCities() {
    return Hospital.distinct('city')
  },

  async listDepartments() {
    return Hospital.distinct('departments')
  },
}
