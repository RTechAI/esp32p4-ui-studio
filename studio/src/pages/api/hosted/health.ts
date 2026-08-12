import type { NextApiRequest, NextApiResponse } from 'next'
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.FORGEUI_RUNTIME_MODE !== 'hosted' || req.method !== 'GET') return res.status(404).end()
  return res.status(200).json({ ok: true, service: 'forgeui-hosted' })
}
