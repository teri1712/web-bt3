// server.js
const express = require("express");
const app = express();
const path = require("path");

// Import your custom template engine
const customEngine = require("./22243");

app.engine("22243", customEngine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "22243");

app.listen(8080, () => {
  console.log("Server is running on port 3000");
});
// server.js
app.get("/", (req, res) => {
  res.render("index", {
    x: true,
    nested: false,
    arr: [
      {
        prop3: ["Detail A", "Detail B"],
        prop1: "Item 1",
        prop2: "/images/img1.jpg",
      },
      {
        prop3: ["Detail C", "Detail D"],
        prop1: "Item 2",
        prop2: "/images/img2.jpg",
      },
    ],
  });
});
