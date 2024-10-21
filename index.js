const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const addDoubts = require("./routes/addDoubt");

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS) if needed
app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route for handling doubts
app.use("/doubts", addDoubts);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
