/**
 * Google Apps Script - Renato & Joyce
 * Web App: Executar como "Eu", Acesso "Qualquer pessoa"
 */

const SHEET_ID = '1m870IB8_uk8vIjzIsdECHfgGN62I5LXKPR4uGyYEguI';

const SHEET_NAMES = {
  confirmacoes: 'Confirmacoes',
  presentes: 'Presentes',
  recados: 'Recados'
};

function getSheet(aba) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheetName = SHEET_NAMES[aba];
  if (!sheetName) throw new Error('Aba invalida: ' + aba);
  return ss.getSheetByName(sheetName);
}

function doGet(e) {
  var aba = e.parameter.aba;
  if (!aba) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Parametro aba obrigatorio' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var sheet = getSheet(aba);
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j];
      }
      rows.push(obj);
    }

    return ContentService.createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    if (body.aba === 'confirmacoes') {
      var sheet = getSheet('confirmacoes');
      sheet.appendRow([
        body.timestamp || new Date().toISOString(),
        body.nome || '',
        body.sobrenome || '',
        body.confirmacao || ''
      ]);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (body.aba === 'presentes') {
      var sheet = getSheet('presentes');
      sheet.appendRow([
        body.timestamp || new Date().toISOString(),
        body.nome || '',
        body.sobrenome || '',
        body.presente || '',
        body.valor || '',
        body.recado || '',
        body.status || 'PENDENTE',
        body.correlationID || ''
      ]);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (body.aba === 'recados') {
      var sheet = getSheet('recados');
      sheet.appendRow([
        body.timestamp || new Date().toISOString(),
        body.nome || '',
        body.mensagem || ''
      ]);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (body.presente) {
      var sheet = getSheet('presentes');
      sheet.appendRow([
        body.timestamp || new Date().toISOString(),
        body.nome || '',
        body.sobrenome || '',
        body.presente || '',
        body.valor || '',
        body.recado || '',
        'COMPLETED',
        body.correlationID || ''
      ]);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ error: 'Aba invalida' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
