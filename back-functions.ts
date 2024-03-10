function getData() {   
    const SS = SpreadsheetApp.openById(linkedSpreadsheet);
    const RE = SS.getSheetByName(responsesSheetName);
    const DB = SS.getSheetByName(databasesSheetName);

    if (!RE || !DB) throw new Error('🛑 Cannot find sheets! Make sure they are named: "' + responsesSheetName + '" and "' + databasesSheetName + '"');

    const respArrays = RE.getRange(2, 1, RE.getLastRow(), 3).getValues().filter(row => row[0]);
    const dataArrays = DB.getRange(3, 3, DB.getLastRow(), 2).getValues().filter(row => row[0]);
    const emailEqual = areSetsEqual(new Set(respArrays.map(col => col[2]).flat()), new Set(dataArrays.map(col => col[0]).flat()));

    if (emailEqual !== 'YES') for (const email of emailEqual) dataArrays.push([email, ]);

    for (let i = 0; i < dataArrays.length; i++) dataArrays[i][1] = respArrays.findLast(row => row[2] === dataArrays[i][0]);
    
    DB.getRange(3, 3, dataArrays.length, 2).setValues(dataArrays);
}

function sendFormByEmail() {
    // The URL of your Google Form
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf2XJIgg13d0khFR8yXKlUusnX8hatbv3EmGsl5wD30HWUQtA/viewform';
    
    // Message you want to send along with the form link
    const emailBody = 'Please fill out the daily activities form: ' + formUrl;
    const emailSubject = 'Please fill out the daily activities form';
    
    // Open the sheet - assumes it is the first sheet
    const sheet = SpreadsheetApp.openById(linkedSpreadsheet).getSheetByName(databasesSheetName);

    if (!sheet) throw new Error('🛑 Cannnot find DATA BASE sheet!');
    
    // Get the range of cells that store email addresses
    const dataRange = sheet.getRange(3, 3, sheet.getLastRow(), 1);
    
    // Get the values of each cell within that range
    const data = dataRange.getValues();
    
    // Loop over the values
    for (let i = 0; i < data.length; i++) {
      const emailAddress = data[i][0];  // First column
      
      // Send the email
      MailApp.sendEmail(emailAddress, emailSubject, emailBody);
    }
  }