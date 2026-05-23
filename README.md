# Renato & Joyce

Site de casamento — convite clássico que enlouqueceu.

## Stack
- HTML + CSS + JS puro
- Vercel Serverless Functions (`/api`)
- Hospedado no GitHub + Vercel

## Cores
- Fundo: `#fdf6ee`
- Dourado: `#c9a84c`
- Bordô: `#7a2d35`
- Texto: `#2c2420`
- Blush: `#f2c4b0`

## Fontes
- Títulos: Playfair Display
- Corpo: DM Sans

## Variáveis de Ambiente (Vercel)

Configure estas no painel do Vercel (Project Settings > Environment Variables):

| Variável | Onde obter |
|---|---|
| `MERCADO_PAGO_ACCESS_TOKEN` | Mercado Pago > Desenvolvedores > Credenciais |
| `WEBHOOK_SECRET` | Token secreto gerado por voce (ex: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `SCRIPT_TOKEN` | Token secreto para autenticar o Apps Script (ex: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `EMAILJS_SERVICE_ID` | emailjs.com > Email Services |
| `EMAILJS_TEMPLATE_PRESENTE` | emailjs.com > Email Templates (template de presente) |
| `EMAILJS_TEMPLATE_RSVP` | emailjs.com > Email Templates (template de RSVP) |
| `EMAILJS_PUBLIC_KEY` | emailjs.com > Account > Public Key |
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL do Apps Script publicado (veja abaixo) |
| `BASE_URL` | URL publica do site na Vercel (ex: `https://seusite.vercel.app`) |

**Nunca commite esses valores no código.**

## Passo a Passo de Deploy

### 1. Mercado Pago (Pagamentos PIX)
1. Acesse [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers) e crie sua conta.
2. Vá em **Credenciais > Access Token** e copie o token de produção.
3. Anote para configurar no Vercel como `MERCADO_PAGO_ACCESS_TOKEN`.
4. Gere um `WEBHOOK_SECRET` aleatório (ex: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).

### 2. EmailJS (Notificações por e-mail)
1. Acesse [emailjs.com](https://emailjs.com) e crie uma conta.
2. Crie um **Email Service** e copie o `service_id`.
3. Crie **2 templates**:
   - Um para notificação de **presente** → copie o `template_id` como `EMAILJS_TEMPLATE_PRESENTE`
   - Um para notificação de **RSVP** → copie o `template_id` como `EMAILJS_TEMPLATE_RSVP`
4. Em **Account**, copie sua **Public Key**.

### 3. Google Sheets + Apps Script
1. Crie uma nova planilha no Google Sheets.
2. Crie **3 abas** com os nomes exatos:
   - `Confirmacoes`
   - `Presentes`
   - `Recados`
3. Na primeira linha de cada aba, adicione os cabeçalhos:
   - **Confirmacoes**: Timestamp | Nome | Sobrenome | Confirmação
   - **Presentes**: Timestamp | Nome | Sobrenome | Presente | Valor | Recado | Status | CorrelationID
   - **Recados**: Timestamp | Nome | Mensagem
4. Abra **Extensions > Apps Script**.
5. Cole o conteúdo do arquivo `apps-script.gs`.
6. Vá em **Project Settings > Script Properties** e adicione:
   - `SHEET_ID`: ID da planilha (encontrado na URL)
   - `SCRIPT_TOKEN`: token secreto gerado no passo 1
7. Clique em **Deploy > New deployment > Web app**.
8. Configure:
   - **Execute as**: Me
   - **Who has access**: Anyone
9. Copie a **URL do Web App** → essa é a `GOOGLE_SHEETS_WEBHOOK_URL`.

### 4. GitHub
1. Crie um novo repositório público no GitHub.
2. Envie os arquivos do projeto:
   ```bash
   git init
   git add .
   git commit -m "Primeiro commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
   git push -u origin main
   ```

### 5. Vercel
1. Acesse [vercel.com](https://vercel.com) e importe o repositório GitHub.
2. Nas **Project Settings > Environment Variables**, adicione todas as 9 variáveis listadas acima.
3. Re-deploy o projeto após adicionar as variáveis.

### 6. Configurar Webhook Mercado Pago
1. No painel do Mercado Pago, vá em **Notificações > Webhooks**.
2. Adicione a URL com o secret (substitua pelo seu dominio real):
   `https://seusite.vercel.app/api/pix-confirmado?secret=SEU_WEBHOOK_SECRET`
3. Selecione o evento **Pagamento (payment)**.
4. Salve.

> Nota: as credenciais e URLs nao ficam mais no frontend. Tudo e gerenciado pelo backend na Vercel.

## Personalizações Antes de Publicar

- **Data do casamento**: Edite `script.js` e altere a data em `new Date('2026-02-14T17:00:00-03:00')` para a data real.
- **Local do evento**: Edite `index.html` e atualize o nome do local, endereço e link do Google Maps na seção Informações do Evento.
- **Fotos**: Adicione 6 fotos na pasta `assets/fotos/` com os nomes `foto1.jpg` até `foto6.jpg`.
- **E-mail de notificação**: Verifique se o e-mail de destino nos templates do EmailJS está correto.

## Estrutura
```
casamento-renato-joyce/
├── index.html
├── style.css
├── script.js
├── apps-script.gs
├── api/
│   ├── criar-cobranca.js
│   ├── pix-confirmado.js
│   └── checar-status.js
├── assets/fotos/
└── README.md
```

## Custos

| Serviço | Custo |
|---|---|
| Hospedagem Vercel | Grátis |
| GitHub | Grátis |
| EmailJS | Grátis até 200 e-mails/mês |
| Google Sheets + Apps Script | Grátis |
| OpenPix | 0,8% por PIX recebido (sem mensalidade) |

**Estimativa total** se todos os 92 presentes forem comprados: ~R$56,00 de taxa.
