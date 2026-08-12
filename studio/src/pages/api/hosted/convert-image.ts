import type { NextApiRequest, NextApiResponse } from 'next'

export const config = { api: { bodyParser: { sizeLimit: '10mb' }, responseLimit: false } }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.FORGEUI_RUNTIME_MODE !== 'hosted' || req.method !== 'POST') {
    res.status(404).json({ ok: false, error: 'Not found' })
    return
  }
  try {
    res.status(200).json(require('../../../../hosted-runtime').convertHostedImage(req.body || {}))
  } catch (error) {
    res.status(400).json({ ok: false, error: require('../../../../hosted-runtime').safeError(error) })
  }
}
