// Configuration
const SPREADSHEET_ID = "1QwnAG2vFCDElnXDN1CRBR51reRLWTEGNH5lZTLiUkBE"; // Replace with your actual spreadsheet ID
const SHEET_NAME = "Applications";
const SECRET_KEY = "geeks-secret"; // Must match the one in your JavaScript

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    });
}

/**
 * Function to handle GET requests
 * Returns all applications when called
 */
function doGet(e) {
  try {
    const applications = getAllApplications();

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        data: applications,
        count: applications.length,
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Error in doGet:", error);
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Function to get all applications from the sheet
 */
function getAllApplications() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      console.log("no sheet found");
      return [];
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const applications = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const application = {};

      headers.forEach((header, index) => {
        application[header] = row[index];
      });

      applications.push(application);
    }

    return applications;
  } catch (error) {
    console.error("Error getting applications:", error);
    return [];
  }
}

/**
 * Main function to handle POST requests from the form
 * This function is called when the form is submitted
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = e?.postData?.contents ? JSON.parse(e?.postData?.contents) : {};

    // Validate the secret key
    if (data.secretKey !== SECRET_KEY) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "Unauthorized access",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Add timestamp
    data.timestamp = new Date().toISOString();

    // Store the data in Google Sheets
    const success = storeApplicationData(data);

    if (success) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: true,
          message: "Application submitted successfully",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: "Failed to store application data",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error("Error processing application:", error);
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Store application data in Google Sheets
 */
function storeApplicationData(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = createApplicationsSheet(spreadsheet);
    }

    // Prepare row data
    const rowData = [
      data.timestamp,
      data.firstName,
      data.lastName,
      data.email,
      data.age,
      data.education,
      data.city,
      data.availability,
      data.domainsOfInterest,
    ];

    // Append the data to the sheet
    sheet.appendRow(rowData);

    // Auto-resize columns
    // sheet.autoResizeColumns(1, rowData.length + 5);

    return true;
  } catch (error) {
    console.error("Error storing application data:", error);
    return false;
  }
}

/**
 * Create the applications sheet with headers
 */
function createApplicationsSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet(SHEET_NAME);

  // Set headers
  const headers = [
    "Timestamp",
    "First Name",
    "Last Name",
    "Email",
    "Age",
    "Education Level",
    "City",
    "Availability",
    "Domain of interest",
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Style headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#FFA500");
  headerRange.setFontColor("white");

  // Freeze header row
  sheet.setFrozenRows(1);

  return sheet;
}
