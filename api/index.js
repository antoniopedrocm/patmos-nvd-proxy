// api/index.js
// Função principal da API - redireciona para endpoints específicos

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Informações da API
  const apiInfo = {
    name: "Patmos NVD Proxy API",
    version: "1.0.0",
    status: "online",
    timestamp: new Date().toISOString(),
    endpoints: {
      "GET /api/nvd": "Proxy para NVD API",
      "GET /api/vulnerabilities": "Alias para /api/nvd",
      "GET /": "Esta página de informações"
    },
    usage: {
      "required_params": ["pubStartDate", "pubEndDate"],
      "optional_params": ["startIndex", "resultsPerPage"],
      "example": "/api/nvd?pubStartDate=2024-01-01T00:00:00.000&pubEndDate=2024-01-02T00:00:00.000"
    },
    documentation: "https://nvd.nist.gov/developers/vulnerabilities"
  };

  res.status(200).json(apiInfo);
}
