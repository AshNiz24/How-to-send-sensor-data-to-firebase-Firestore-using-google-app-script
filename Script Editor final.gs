function doGet(e) { 
  Logger.log( JSON.stringify(e) );  // view parameters
  var result = 'Ok'; // assume success
  if (e.parameter == 'undefined') {
    result = 'No Parameters';
  }
  else {
    var sheet_id = 'Your spreadsheet ID'; 		// Spreadsheet ID
    var sheet = SpreadsheetApp.openById(sheet_id).getActiveSheet();		// get Active sheet
    var newRow = sheet.getLastRow() + 1;						
    var rowData = [];
    for (var param in e.parameter) {
      Logger.log('In for loop, param=' + param);
      var value = stripQuotes(e.parameter[param]);
      Logger.log(param + ':' + e.parameter[param]);
      switch (param) {
        case 'Temperature': //Parameter
          rowData[0] = value; //Value in column A
          result = 'Written on column A';
          break;
        case 'Humidity': //Parameter
          rowData[1] = value; //Value in column B
          result += ' ,Written on column B';
          break;  
        default:
          result = "unsupported parameter";
      }
    }
    Logger.log(JSON.stringify(rowData));
    // Write new row below
    var newRange = sheet.getRange(newRow, 1, 1, rowData.length);
    newRange.setValues([rowData]);
  }
  // Return result of operation
  firestore();
  return ContentService.createTextOutput(result);
}
/**
* Remove leading and trailing single or double quotes
*/
function stripQuotes( value ) {
  return value.replace(/^["']|['"]$/g, "");
}

function firestore(){
//add firebase library to script before running the code
//get firebase project credentials from GCP and add data from the created json key below
   const email = "CLIENT EMAIL ID";
   const key = "YOUR PRIVATE KEY";
   const projectId = "YOUR PROJECT ID";
   var firestore = FirestoreApp.getFirestore (email, key, projectId);

// get document data from ther spreadsheet
   var ss = SpreadsheetApp.getActiveSpreadsheet();
   //Give the sheetname of your spreadsheet
   var sheetname = "YOUR SHEET NAME"; 
   var sheet = ss.getSheetByName(sheetname); 
   // get the last row and column in order to define range
   var sheetLR = sheet.getLastRow(); // get the last row
   var sheetLC = sheet.getLastColumn(); // get the last column
   var dataSR = 2; // the first row of data
   // define the data range
   var sourceRange = sheet.getRange(2,1,sheetLR-dataSR+1,sheetLC);

   // get the data
   var sourceData = sourceRange.getValues();
   // get the number of length of the object in order to establish a loop value
   var sourceLen = sourceData.length;
  
  // Loop through the rows
   for (var i= sourceLen-1;i<sourceLen;i++){
     if (sourceData[i][1] !=='') {
       var data = {};
       
      data.temperature = sourceData[i][0];
       data.humidity=sourceData[i][1];
       firestore.createDocument("datalog",data);

     } 
    
  }
