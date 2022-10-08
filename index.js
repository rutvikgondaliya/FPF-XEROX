const express = require("express");
const { google } = require("googleapis")
const keyFile = require("fpf-vgec-xerox.json")

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("FPF-XEROX-API");
})

const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

app.post("/", async (req, res) => {

    const { row } = req.body;

    // const spreadsheetId = "1Pbg5NOzkWKCvHIp5bIqj0pjcxmRpxY8IbE3kWjU3Vns";
    const spreadsheetId = "11SEeWywXK5fOdxd82A6hKkE6m4GTpyf4M2yRfeP51Dw";

    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version: "v4",
        auth: client
    });

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "sheet 1",
    })

    // await googleSheets.spreadsheets.range("B2")
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: `sheet 1!B${row + 1}`,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [["DONE"]]
        }
    })
})


app.get("/data", async (req, res) => {

    const spreadsheetId = "11SEeWywXK5fOdxd82A6hKkE6m4GTpyf4M2yRfeP51Dw";

    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version: "v4",
        auth: client
    });

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "sheet 1",
    })


    res.send(getRows.data);
})

app.listen(3000, (req, res) => console.log("running on 3000"));