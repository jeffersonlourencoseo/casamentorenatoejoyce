module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const aba = body.aba;

  if (!aba) {
    res.status(400).json({ error: 'Campo aba obrigatorio' });
    return;
  }

  const googleUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const scriptToken = process.env.SCRIPT_TOKEN;

  if (!googleUrl || !scriptToken) {
    res.status(500).json({ error: 'Configuracao incompleta no servidor' });
    return;
  }

  // Validacao basica por aba
  if (aba === 'confirmacoes') {
    if (!body.nome || !body.sobrenome || !body.confirmacao) {
      res.status(400).json({ error: 'Campos obrigatorios: nome, sobrenome, confirmacao' });
      return;
    }
  } else if (aba === 'presentes' || body.presente) {
    if (!body.nome || !body.sobrenome || !body.presente || body.valor == null) {
      res.status(400).json({ error: 'Campos obrigatorios: nome, sobrenome, presente, valor' });
      return;
    }
  } else if (aba === 'recados') {
    if (!body.nome || !body.mensagem) {
      res.status(400).json({ error: 'Campos obrigatorios: nome, mensagem' });
      return;
    }
  }

  try {
    const payload = { ...body, token: scriptToken };

    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      res.status(response.status || 500).json({ error: data.error || 'Erro ao salvar dados' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erro interno' });
  }
};
