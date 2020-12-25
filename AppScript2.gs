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

}
