function getData() {   
    const SS = SpreadsheetApp.openById(linkedSpreadsheet), PR = SpreadsheetApp.openById(linkedFinalReport);
    const RE = SS.getSheetByName(responsesSheetName), EM = SS.getSheetByName(databasesSheetName);
    const DB = PR.getSheetByName(reportDatabaseName);

    if (!RE || !EM || !DB) throw new Error('🛑 Cannot find sheets named "' + responsesSheetName + '" and "' + databasesSheetName + '"');

    const respRange = new Range(RE, {columns: ['Time', 'Activties', 'Email']});
    const respArrays = respRange.range().getValues().filter(row => row[0]);
    const dateArrays = DB.getRange(2, 1, DB.getLastRow(), 3).getValues().filter(row => row[0]);
    const dataArrays = EM.getRange(3, 3, EM.getLastRow(), 4).getValues().filter(row => row[0]);
    const emailEqual = areSetsEqual(new Set(respArrays.map(col => col[2]).flat()), new Set(dataArrays.map(col => col[0]).flat()));

    if (emailEqual !== 'YES') for (const email of emailEqual) dataArrays.push([email, , , ]);

    for (let i = 0; i < dataArrays.length; i++) {
      dataArrays[i][1] = respArrays.findLast(row => row[2] === dataArrays[i][0]);
      dataArrays[i][3] = dateArrays.findLast(row => row[0] === dataArrays[i][2])?.[2] ?? '';
    }

    setDataValidation(EM.getRange(3, 5, EM.getLastRow(), 1), dateArrays.map(col => col[0]).flat().filter(Boolean));
    EM.getRange(3, 3, dataArrays.length, 4).setValues(dataArrays);
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