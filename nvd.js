// api/nvd.js
export default async function handler(req, res) {
  // CORS: ajuste os domínios permitidos aqui ou via variável de ambiente
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const origin = req.headers.origin || '';
  const isAllowed = allowedOrigins.length === 0 || allowedOrigins.includes(origin);

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { pubStartDate, pubEndDate, startIndex = '0', resultsPerPage = '2000' } = req.query;

    if (!pubStartDate || !pubEndDate) {
      res.status(400).json({ error: 'Parâmetros obrigatórios: pubStartDate e pubEndDate' });
      return;
    }

    const url = new URL('https://services.nvd.nist.gov/rest/json/cves/2.0');
    url.searchParams.set('pubStartDate', pubStartDate);
    url.searchParams.set('pubEndDate', pubEndDate);
    url.searchParams.set('startIndex', startIndex);
    url.searchParams.set('resultsPerPage', resultsPerPage);

    const headers = {};
    if (process.env.NVD_API_KEY) {
      headers['apiKey'] = process.env.NVD_API_KEY; // opcional, se você tiver uma chave da NVD
    }

    const r = await fetch(url, { headers });
    if (!r.ok) {
      const text = await r.text();
      res.status(r.status).send(text);
      return;
    }

    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Falha ao consultar a NVD', detail: String(err) });
  }
}
