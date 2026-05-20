/**
 * Google Apps Script — Renato & Joyce
 * Web App: Executar como "Eu", Acesso "Qualquer pessoa"
 */

const SHEET_ID = 'COLOQUE_AQUI_O_ID_DA_PLANILHA'; // Substitua pelo ID real da planilha

function doGet(e) {
  const aba = e.parameter.aba || 'recados';
  const sheet = SpreadsheetApp.openById(SHEET_ID);
  let targetSheet;

  if (aba === 'confirmacoes') {
    targetSheet = sheet.getSheetByName('Confirmacoes') || sheet.getSheets()[0];
  } else if (aba === 'presentes') {
    targetSheet = sheet.getSheetByName('Presentes') || sheet.getSheets()[1];
  } else {
    targetSheet = sheet.getSheetByName('Recados') || sheet.getSheets()[2];
  }

  const data = targetSheet.getDataRange().getValues();
  // Skip header row
  const rows = data.slice(1).map(row => {
    const obj = {};
    data[0].forEach((header, i) => {
      obj[String(header).toLowerCase().replace(/\s/g, '_')] = row[i];
    });
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const aba = body.aba || 'recados';
  const sheet = SpreadsheetApp.openById(SHEET_ID);
  let targetSheet;

  if (aba === 'confirmacoes') {
    targetSheet = sheet.getSheetByName('Confirmacoes') || sheet.getSheets()[0];
    targetSheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.nome || '',
      body.sobrenome || '',
      body.confirmacao || ''
    ]);
  } else if (aba === 'presentes') {
    targetSheet = sheet.getSheetByName('Presentes') || sheet.getSheets()[1];
    targetSheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.nome || '',
      body.sobrenome || '',
      body.presente || '',
      body.valor || '',
      body.recado || '',
      body.status || 'COMPLETED',
      body.correlationid || body.correlationID || ''
    ]);
  } else if (aba === 'markPurchased') {
    targetSheet = sheet.getSheetByName('Presentes') || sheet.getSheets()[1];
    const data = targetSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][7] === body.correlationID) {
        targetSheet.getRange(i + 1, 8).setValue('COMPLETED');
        break;
      }
    }
  } else {
    targetSheet = sheet.getSheetByName('Recados') || sheet.getSheets()[2];
    targetSheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.nome || '',
      body.mensagem || ''
    ]);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
