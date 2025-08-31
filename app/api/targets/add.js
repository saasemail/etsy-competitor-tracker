export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || !url.includes('etsy.com')) {
    return res.status(400).json({ error: 'Invalid Etsy URL' });
  }

  // Simulacija uspešnog dodavanja
  console.log('Tracking URL:', url);

  return res.status(200).json({ success: true });
}
