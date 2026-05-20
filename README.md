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
| `OPENPIX_APP_ID` | Painel OpenPix > API/Plugins > App ID |
| `OPENPIX_WEBHOOK_SECRET` | Painel OpenPix > Webhooks > Secret |
| `EMAILJS_SERVICE_ID` | emailjs.com > Email Services |
| `EMAILJS_TEMPLATE_PRESENTE` | emailjs.com > Email Templates (template de presente) |
| `EMAILJS_TEMPLATE_RSVP` | emailjs.com > Email Templates (template de RSVP) |
| `EMAILJS_PUBLIC_KEY` | emailjs.com > Account > Public Key |
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL do Apps Script publicado (veja abaixo) |

**Nunca commite esses valores no código.**

## Passo a Passo de Deploy

### 1. OpenPix (Pagamentos PIX)
1. Acesse [woovi.com](https://woovi.com) e crie sua conta OpenPix.
2. Cadastre sua chave PIX.
3. Vá em **API/Plugins** e copie o **App ID**.
4. Vá em **Webhooks** e copie o **Webhook Secret**.
5. Anote ambos para configurar no Vercel.

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
6. Substitua `COLOQUE_AQUI_O_ID_DA_PLANILHA` pelo ID real da sua planilha (encontrado na URL).
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
2. Nas **Project Settings > Environment Variables**, adicione todas as 7 variáveis listadas acima.
3. Re-deploy o projeto após adicionar as variáveis.

### 6. Configurar Webhook OpenPix
1. No painel da OpenPix, vá em **Webhooks**.
2. Adicione a URL: `https://seusite.vercel.app/api/pix-confirmado`
3. Selecione o evento de confirmação de pagamento.

## Configuração do Frontend

Abra `index.html` e localize o bloco `window.APP_CONFIG` (no final, antes do `<script src="script.js">`). Preencha os valores:

```js
window.APP_CONFIG = {
  googleSheetsWebhookUrl: 'COLE_AQUI_A_URL_DO_APPS_SCRIPT',
  emailjsServiceId: '',
  emailjsTemplatePresente: '',
  emailjsTemplateRsvp: '',
  emailjsPublicKey: ''
};
```

> Nota: `googleSheetsWebhookUrl` é obrigatória para que a lista de presentes, RSVP e mural funcionem. As variáveis EmailJS são opcionais (apenas desativam notificações por e-mail se omitidas).

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
