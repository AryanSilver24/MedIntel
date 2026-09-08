import fs from 'node:fs/promises'
import { reportRepository } from '../../data/repositories/index.js'
import { jobQueue, JOBS } from '../../data/queue/index.js'
import { aiService } from '../../ai/aiService.js'
import { extractText, ocrAvailable } from './ocrAdapter.js'
import { historyService } from '../history/historyService.js'
import { audit, AUDIT } from '../../shared/audit.js'
import { logger } from '../../shared/logger.js'
import { NotFoundError } from '../../shared/errors.js'

/**
 * Report ingestion (ADR-06). Upload responds immediately with a Queued record; OCR and
 * summarisation run on the job queue. The accepted price is eventual consistency — the
 * client polls or refreshes to see the summary appear.
 */
export const reportService = {
  async upload({ userId, file, name, lab, reportDate, ip }) {
    const report = await reportRepository.create({
      userId,
      name: name || file.originalname.replace(/\.[^.]+$/, ''),
      lab: lab || 'Unknown lab',
      reportDate: reportDate ? new Date(reportDate) : new Date(),
      file: {
        originalName: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      },
      status: 'Queued',
      tone: 'amber',
    })

    jobQueue.enqueue(JOBS.PROCESS_REPORT, { reportId: String(report._id), userId: String(userId), path: file.path })

    await historyService.record({
      userId,
      kind: 'Report',
      tone: 'amber',
      title: `${report.name} uploaded`,
      body: 'Queued for text extraction and summarisation.',
      sourceId: report._id,
    })
    await audit({
      actorId: userId,
      action: AUDIT.REPORT_UPLOAD,
      resource: 'report',
      resourceId: String(report._id),
      ip,
      metadata: { mimeType: file.mimetype, sizeBytes: file.size },
    })

    return present(report)
  },

  async list({ userId }) {
    const items = await reportRepository.listForUser(userId)
    return items.map(present)
  },

  async get({ userId, reportId }) {
    const report = await reportRepository.findByIdForUser(reportId, userId)
    if (!report) throw new NotFoundError('Report')
    return present(report)
  },

  async remove({ userId, reportId, ip }) {
    const report = await reportRepository.deleteForUser(reportId, userId)
    if (!report) throw new NotFoundError('Report')
    if (report.file?.storedName) {
      await fs.unlink(new URL(`../../../uploads/${report.file.storedName}`, import.meta.url)).catch(() => {})
    }
    await audit({ actorId: userId, action: AUDIT.REPORT_DELETE, resource: 'report', resourceId: reportId, ip })
    return { deleted: true }
  },

  /** Job handler. Registered on the queue at boot — never called from a request path. */
  async processReport({ reportId, userId, path }) {
    await reportRepository.update(reportId, { status: 'Processing' })

    try {
      const { text, provider } = await extractText({
        filePath: path,
        mimeType: (await reportRepository.findByIdForUser(reportId, userId))?.file?.mimeType,
      })
      logger.info('report text extracted', { reportId, provider, chars: text.length })

      const ai = await aiService.summariseReport({ text, actorId: userId })
      const flags = ai.findings.filter((f) => f.flagged).length

      await reportRepository.update(reportId, {
        status: 'Summarised',
        tone: flags > 0 ? 'amber' : 'teal',
        extractedText: text.slice(0, 20000),
        summary: ai.summary,
        findings: ai.findings,
        flags,
        failureReason: undefined,
      })

      await historyService.record({
        userId,
        kind: 'Report',
        tone: flags > 0 ? 'amber' : 'teal',
        title: 'Report summarised',
        body: flags > 0 ? `${flags} value(s) outside the reference range.` : 'All reported values within reference range.',
        sourceId: reportId,
      })
    } catch (err) {
      logger.warn('report processing failed', { reportId, err: err.message })
      await reportRepository.update(reportId, {
        status: 'Failed',
        tone: 'rose',
        failureReason: ocrAvailable() ? err.message : 'No OCR provider is configured (set OCR_SPACE_API_KEY).',
      })
    }
  },
}

function present(r) {
  return {
    id: String(r._id),
    name: r.name,
    lab: r.lab,
    date: new Date(r.reportDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    reportDate: r.reportDate,
    status: r.status,
    tone: r.tone,
    summary: r.summary ?? null,
    findings: r.findings ?? [],
    flags: r.flags ?? 0,
    failureReason: r.failureReason ?? null,
    createdAt: r.createdAt,
  }
}
