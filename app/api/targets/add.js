// api/targets/add.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Dummy response for now
  res.status(200).json({
    id: Date.now().toString(),
    url,
    title: 'Mock title',
    currentPrice: '$19.99',
    lastChange: null,
    priceHistory: [19.99]
  });
}
