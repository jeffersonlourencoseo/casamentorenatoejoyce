module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const { tipo, nome, sobrenome, presente, valor, recado, confirmacao } = body;

  if (!tipo || !nome) {
    res.status(400).json({ error: 'Campos obrigatorios: tipo, nome' });
    return;
  }

  const emailjsService = process.env.EMAILJS_SERVICE_ID;
  const emailjsTemplate = tipo === 'rsvp'
    ? process.env.EMAILJS_TEMPLATE_RSVP
    : process.env.EMAILJS_TEMPLATE_PRESENTE;
  const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!emailjsService || !emailjsTemplate || !emailjsPublicKey) {
    res.status(500).json({ error: 'Servico de e-mail nao configurado' });
    return;
  }

  const fullName = `${(nome || '').trim()} ${(sobrenome || '').trim()}`;
  let subject = '';
  let message = '';

  if (tipo === 'rsvp') {
    subject = `✅ ${nome} confirmou presenca!`;
    message = `Confirmou presenca: ${confirmacao || ''}`;
  } else if (tipo === 'presente') {
    subject = `🎁 ${nome} comprou um presente!`;
    const valorFmt = typeof valor === 'number'
      ? 'R$' + valor.toFixed(2).replace('.', ',')
      : valor || '';
    message = `Presente: ${presente || ''} (${valorFmt})\nRecado: ${recado || 'Nenhum recado'}`;
  } else {
    res.status(400).json({ error: 'Tipo de e-mail invalido' });
    return;
  }

  try {
    const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: emailjsService,
        template_id: emailjsTemplate,
        user_id: emailjsPublicKey,
        template_params: {
          to_name: 'Renato & Joyce',
          from_name: fullName,
          subject,
          message,
          timestamp: new Date().toLocaleString('pt-BR')
        }
      })
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('EmailJS erro:', emailRes.status, errText);
      res.status(500).json({ error: 'Erro ao enviar e-mail' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (e) {
    console.error('EmailJS exception:', e);
    res.status(500).json({ error: e.message || 'Erro interno' });
  }
};
