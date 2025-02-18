function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

// Function to add a new entry to the spreadsheet
function addEntry(name, phoneNumber, item, quantity, amount, date) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  
  let found = false;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === name) {
      found = true;
      let dueAmount = data[i][6];
      sheet.getRange(i + 1, 6).setValue(dueAmount + amount); // Update due amount
      break;
    }
  }

  if (!found) {
    sheet.appendRow([name, phoneNumber, item, quantity, amount, date, amount]);
  }
}

// Function to send WhatsApp notifications
function sendWhatsAppNotifications() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const dueAmount = data[i][6];
    const phoneNumber = data[i][1];
    if (dueAmount > 0) {
      sendMessage(phoneNumber, dueAmount);
    }
  }
}

// Helper function to send WhatsApp message
function sendMessage(phoneNumber, dueAmount) {
  // Placeholder for sending WhatsApp notifications.
  // You will need to integrate with WhatsApp API or use a service like Twilio.
  Logger.log(`Sending message to ${phoneNumber} for due amount ${dueAmount}`);
}

// Function to clear dues for a specific name
function clearDues(name, amount) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === name) {
      let dueAmount = data[i][6] - amount;
      if (dueAmount < 0) dueAmount = 0; // Prevent negative due amounts
      sheet.getRange(i + 1, 6).setValue(dueAmount);
      break;
    }
  }
}
