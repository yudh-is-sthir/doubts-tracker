const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../doubts.json");

router.post("/add", (req, res) => {
  const { DoubtsArea } = req.body;

  // Split the textarea input into multiple doubts by newlines
  let newDoubts = DoubtsArea.split("\n").map((doubt) => doubt.trim()).filter(Boolean);  // Filter out any empty lines

  // Read the existing data from doubts.json
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }

    let doubtsData = [];
    try {
      doubtsData = JSON.parse(data);

      // If the data isn't an array (or is null), initialize it as an empty array
      if (!Array.isArray(doubtsData)) {
        doubtsData = [];
      }
    } catch (err) {
      console.error("Error parsing JSON. Initializing empty array:", err);
      doubtsData = [];
    }

    // Append new, non-duplicate doubts to the existing data
    newDoubts = newDoubts.filter(doubt => !doubtsData.includes(doubt));
    doubtsData.push(...newDoubts);

    // Write the updated data back to the file
    fs.writeFile(filePath, JSON.stringify(doubtsData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return res.status(500).send("Error writing file");
      }

      // Send the updated list of doubts back as JSON to the frontend
      res.json(doubtsData);  // Always return an array, even if empty
    });
  });
});

module.exports = router;
