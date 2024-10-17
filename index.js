const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const addDoubts = require("./routes/addDoubt");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route for adding doubts
app.use("/doubts", addDoubts);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
