function onEdit(e) {
  
  //Open spreadsheet, get sheets, get last row of each sheets
  class spreadsheet {
    constructor(id,name,column,numrow,numcol){
      this.id = id;
      this.name = name;
      this.column = column
      this.numrow = numrow
      this.numcol = numcol
    }
    get opensheet(){
      return SpreadsheetApp.openById(this.id).getSheetByName(this.name);
    }
    get lastrow(){
      return this.open().getSheetByName(this.name).getLastRow();
    }
    get last_content(){
      return this.opensheet().getrange(this.lastrow(),this.column,this.numrow,this.numcol);
    }
    get clean_content(){
      return this.last_content().join().split().filter(item => item)
    }
  }
  let data_sheet = new spreadsheet('1AHALGM9DTP4BAAIhR0NKhkNEREyAjaubVTS-wIXHF5s','Response',4,1,36);
  let content = data_sheet.clean_content()
  let response = new spreadsheet('1AHALGM9DTP4BAAIhR0NKhkNEREyAjaubVTS-wIXHF5s','Response',1,1,3)
  let requester = response.clean_content()

 /* var ss = SpreadsheetApp.openById('1AHALGM9DTP4BAAIhR0NKhkNEREyAjaubVTS-wIXHF5s');
  var sheet = ss.getSheetByName('Response');
  var info_sheet = ss.getSheetByName('Ticket')
  var last_row = sheet.getLastRow();
  var info_lastrow = info_sheet.getLastRow();
  //Get data range that will be imported into the new sheet. The last digit (36) determine how many data row will the script scan
  var data_range = sheet.getRange(last_row,4,1,36); // Add/remove row to data_range everytime you add/remove a question
  var rrange = sheet.getRange(last_row,1,1,3);
  // Get values from selected data range and clean them up, as well as requester info. 
  var raw_content = data_range.getValues()
  var raw_r = rrange.getValues()
  var content = raw_content.join().split(',') 
  content = content.filter(item => item)// Remove all null data from content. 
  var requester = raw_r.join().split(',')*/
  var info_sheet = ss.getSheetByName('Ticket') // Sheet where we move content into. 
  // Add requester information into info_sheet 
  info_sheet.appendRow(["Ticket Subject: " + requester[2]])
  info_sheet.appendRow(["Requester: " + requester[1]])
  info_sheet.appendRow(["Timestamp: " +requester[0]])
  // Add ticket information into target sheet
  for(var x=0;x < content.length; x++){ //iterate through each item in the collected content, printing them into individual rows. 
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
  var post_url = 'https://hooks.slack.com/services/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' // Change webhook URL to match.
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
 