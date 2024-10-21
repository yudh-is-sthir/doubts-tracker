const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "../doubts.json");

// Add doubts route
router.post("/add", (req, res) => {
  const { DoubtsArea } = req.body;

  // Split the textarea input into multiple doubts by newlines
  let newDoubts = DoubtsArea.split("\n")
    .map((doubt) => doubt.trim()) // Remove leading/trailing whitespace
    .map((doubt) => doubt.replace(/^\W+|\W+$/g, "")) // Remove non-alphanumeric chars from start/end
    .filter(Boolean); // Filter out any empty lines

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
    newDoubts = newDoubts.filter(
      (doubt) => !doubtsData.some((d) => d.doubt === doubt)
    );
    doubtsData.push(
      ...newDoubts.map((doubt) => ({ text: doubt, status: "active" }))
    );

    // Write the updated data back to the file
    fs.writeFile(filePath, JSON.stringify(doubtsData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return res.status(500).send("Error writing file");
      }

      // Send the updated list of doubts back as JSON to the frontend
      res.json(doubtsData); // Always return an array, even if empty
    });
  });
});

// Delete doubt route
router.post("/delete/:id", (req, res) => {
  const doubtId = req.params.id;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }

    let doubtsData = JSON.parse(data);
    if (doubtsData[doubtId]) {
      doubtsData[doubtId].status = "deleted";
      fs.writeFile(filePath, JSON.stringify(doubtsData, null, 2), (err) => {
        if (err) {
          return res.status(500).send("Error writing file");
        }
        res.redirect("/");
      });
    }
  });
});

// Complete doubt route
router.post("/complete/:id", (req, res) => {
  const doubtId = req.params.id;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }

    let doubtsData = JSON.parse(data);
    if (doubtsData[doubtId]) {
      doubtsData[doubtId].status = "completed";
      fs.writeFile(filePath, JSON.stringify(doubtsData, null, 2), (err) => {
        if (err) {
          return res.status(500).send("Error writing file");
        }
        res.redirect("/");
      });
    }
  });
});

// Edit doubt route
router.post("/edit/:id", (req, res) => {
  const doubtId = req.params.id;
  const { text } = req.body;

  console.log(text);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }

    let doubtsData = JSON.parse(data);
    if (doubtsData[doubtId]) {
      doubtsData[doubtId].text = text; // Update the text of the doubt
      fs.writeFile(filePath, JSON.stringify(doubtsData, null, 2), (err) => {
        if (err) {
          return res.status(500).send("Error writing file");
        }
        res.redirect("/");
      });
    }
  });
});

router.get("/list", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }

    let doubtsData = [];
    try {
      doubtsData = JSON.parse(data);
      if (!Array.isArray(doubtsData)) {
        doubtsData = [];
      }
    } catch (err) {
      console.error("Error parsing JSON:", err);
      doubtsData = [];
    }

    // Send the doubts back as JSON
    console.log(doubtsData);
    res.json(doubtsData);
  });
});

module.exports = router;
