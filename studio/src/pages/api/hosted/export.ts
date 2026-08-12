import type { NextApiRequest, NextApiResponse } from 'next'

export const config = { api: { bodyParser: { sizeLimit: '80mb' }, responseLimit: false } }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.FORGEUI_RUNTIME_MODE !== 'hosted' || req.method !== 'POST') {
    res.status(404).json({ ok: false, error: 'Not found' })
    return
  }
  try {
    require('../../../../hosted-runtime').streamHostedExport(req.body || {}, res)
  } catch (error: any) {
    res.status(error?.statusCode || 400).json({ ok: false, error: require('../../../../hosted-runtime').safeError(error) })
  }
}
