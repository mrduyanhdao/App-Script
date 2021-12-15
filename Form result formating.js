function onEdit(e) {
  
    //Open spreadsheet, get sheets, get last row of each sheets
    var ss = SpreadsheetApp.openById('1AHALGM9DTP4BAAIhR0NKhkNEREyAjaubVTS-wIXHF5s');
    var sheet = ss.getSheetByName('Response');
    var info_sheet = ss.getSheetByName('Ticket')
    var last_row = sheet.getLastRow();
    var info_lastrow = info_sheet.getLastRow();
    //Get data range that will be imported into the new sheet. 
    var data_range = sheet.getRange(last_row,4,1,36); /* The last digit (36) determine how many data row will the script scan. 
    Add/remove row to data_range everytime you add/remove a question*/
    var rrange = sheet.getRange(last_row,1,1,3);
    // Get values from selected data range and clean them up
    var raw_content = data_range.getValues()
    var raw_r = rrange.getValues()
    var content = raw_content.join().split(',')
    content = content.filter(item => item)
    var requester = raw_r.join().split(',')
    var info_sheet = ss.getSheetByName('Ticket')
    // Add requester information into sheet 
    info_sheet.appendRow(["Ticket Subject: " + requester[2]])
    info_sheet.appendRow(["Requester: " + requester[1]])
    info_sheet.appendRow(["Timestamp: " +requester[0]])
    // Add ticket information into sheet
    for(var x=0;x < content.length; x++){
    info_sheet.appendRow([content[x]])
    };
    // Merging for Ticket Status and Comment section, edit background as ticket are created
    info_sheet.getRange('A'+String(info_lastrow+1)).setBackground('#d9d9d9')  
    info_sheet.getRange('B'+String(info_lastrow+1)+':'+'C'+String(info_lastrow+x+3)).mergeVertically()
    // Sending email to target address
    var email_content = "Ticket Subject: " + requester[2] +"\n" + "Requester: " + requester[1] +"\n" + "Timestamp: " +requester[0]+"\n"
    + "Ticket content" + String(content)
    MailApp.sendEmail({to: "duyanh@itviec.com",
    subject: "New ticket recieved",
    body: email_content});
    // Sending slack message to channel 
    var post_url = 'https://hooks.slack.com/services/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' // Change webhook URL to match space.
    var payload = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": ":bell: *New ticket received* :bell:"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Requester: " + requester[1]
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Timestamp: " + requester[0]
          }
        },
        
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Ticket type:" + requester[2]
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Ticket content:"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": String(content)
          }
        }
      ]
    };
    var options = {
      "method" : "post",
      "payload": JSON.stringify(payload),
    };
    UrlFetchApp.fetch(post_url, options);
     
    }
   