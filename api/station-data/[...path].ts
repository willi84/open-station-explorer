import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pathParts = req.query.path as string[]
  const path = Array.isArray(pathParts) ? pathParts.join('/') : pathParts
  const url = `https://stationservice.noncd.db.de/ss/${path}`
  try {
    const response = await fetch(url)
    const data = await response.json()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300')
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch station data' })
  }
}
