function runQuery1() {
  // Replace this value with the project ID listed in the Google
  // Cloud Platform project.
  const projectId = 'YourProjectID';

  const request = {
    // TODO (developer) - Replace query with yours
    query: 'SELECT * FROM YourTable',
    useLegacySql: false
  };
  let queryResults = BigQuery.Jobs.query(request, projectId);
  const jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  let sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }

  // Get all the rows of results.
  let rows = queryResults.rows;
  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      pageToken: queryResults.pageToken
    });
    rows = rows.concat(queryResults.rows);
  }

  if (!rows) {
    Logger.log('No rows returned.');
    return;
  }
  
  const date = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy")
  var folder=DriveApp.getFolderById('<FolderID>');
  const spreadsheet = SpreadsheetApp.create( date + 'FileName'  );
  const sheet = spreadsheet.getActiveSheet()
  const sheetid = spreadsheet.getId();

  // Append the headers.
  const headers = queryResults.schema.fields.map(function(field) {
    return field.name;
  });
  sheet.appendRow(headers);


  // Append the results.
  var data = new Array(rows.length);
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].f;
    data[i] = new Array(cols.length);
    for (let j = 0; j < cols.length; j++) {
      data[i][j] = cols[j].v;
    }
  }
  sheet.getRange(2, 1, rows.length, headers.length).setValues(data);
    sheet.getRange(1,1,1,6).createFilter();
  var copyFile=DriveApp.getFileById(spreadsheet.getId());
  folder.addFile(copyFile);
  DriveApp.getRootFolder().removeFile(copyFile);
  

  Logger.log('Results spreadsheet created: %s',
      spreadsheet.getUrl());
  DriveApp.getFolderById(sheetid).addEditor('editor_email');


