import express from "express";
import bodyParser from "body-parser";
import { google } from "googleapis";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// 🔑 Load Google API credentials (download JSON from Google Cloud Console)
const credentials = JSON.parse(fs.readFileSync("credentials.json"));
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

// 📌 Replace with your Google Sheet ID
const SPREADSHEET_ID = "1Nl_545XbX0WdDQwK4JAvw-QVWtoGoxN7gpT5tY2P8ho";

// ✅ API to receive booking and insert into Google Sheet
app.post("/booking", async (req, res) => {
  try {
    const { date, persons, place, orders, menu } = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:E", // first 5 columns
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[date, persons, place, orders, menu]],
      },
    });

    res.json({ success: true, message: "Booking saved to Google Sheet!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
