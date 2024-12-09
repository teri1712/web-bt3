import express from "express";
import customEngine from "./22243.js";
import init from "./data-init.js";
const app = express();

app.engine("22243", customEngine);
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", "views");
app.set("view engine", "22243");

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
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

init();

//  <link rel="stylesheet" href="./styles.css" />;
