import type { NextApiRequest, NextApiResponse } from 'next'

type ApiResponse =
  | {
      ok: true
      status: string
    }
  | {
      ok: false
      error: string
    }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')

    return res.status(405).json({
      ok: false,
      error: 'Method not allowed',
    })
  }

  return res.status(200).json({
    ok: true,
    status: 'ForgeUI AI backend alive',
  })
}