import express from "express";
import customEngine from "./22243.js";
import init from "./data-init.js";
import {
  fetchTopFav,
  fetchTopRevenues,
  fetchTopRating,
  getMovie,
} from "./db.js";
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
app.get("/", async (req, res) => {
  const top_movies = await fetchTopRating();
  const revenue_movies = await fetchTopRevenues();
  const fav_movies = await fetchTopFav();

  res.render("index", {
    top_movies: top_movies,
    revenue_movies: revenue_movies,
    fav_movies: fav_movies,
  });
});

app.get("/movie", async (req, res) => {
  const movieId = req.query.movieId;
  const movie = await getMovie(movieId);
  res.render("movie-page", movie);
});

// init();

//  <link rel="stylesheet" href="./styles.css" />;
