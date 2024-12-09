import express, { query } from "express";
import customEngine from "./20220.js";
import dotenv from "dotenv";
// import init from "./data-init.js";
import {
  fetchTopFav,
  fetchTopRevenues,
  fetchTopRating,
  getMovie,
  fetchByActorName,
  fetchByMovieNameOrGenre,
} from "./db.js";

dotenv.config();
const app = express();

app.engine("20220", customEngine);
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", "views");
app.set("view engine", "20220");

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 20220");
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
  console.log(movie);
  res.render("movie-page", movie);
});

app.post("/search", async (req, res) => {
  const op = req.body.op;
  const pattern = req.body.op;
  let movies;
  if (op == "actor") {
    movies = await fetchByActorName(pattern, 0, 6);
  } else {
    movies = await fetchByMovieNameOrGenre(pattern, 0, 6);
  }
  const pages = [];
  for (let i = 0; i < movies.total_page; i++) {
    pages.push(i);
  }
  res.render("search-page", {
    prev_disabled: true,
    prev_enabled: false,
    query:
      "search/" +
      op +
      "?" +
      encodeURIComponent("per_page=6&pattern=" + pattern),
    pages: pages,
    next_disabled: movies.length == 0,
    next_disabled: movies.length != 0,
    movies: movies,
    prev_page: -1,
    next_page: 1,
  });
});
app.get("/search/:op", async (req, res) => {
  const op = req.params.op;
  const pattern = req.query.pattern;
  const page = req.query.page;
  let movies;
  if (op == "actor") {
    movies = await fetchByActorName(pattern, page, 6);
  } else {
    movies = await fetchByMovieNameOrGenre(pattern, page, 6);
  }
  const pages = [];
  for (let i = 0; i < movies.total_page; i++) {
    pages.push(i);
  }
  res.render("search-page", {
    prev_disabled: true,
    prev_enabled: false,
    query:
      "search/" +
      op +
      "?" +
      encodeURIComponent("per_page=6&pattern=" + pattern),
    pages: pages,
    next_disabled: movies.length == 0,
    next_disabled: movies.length != 0,
    movies: movies,
    prev_page: -1,
    next_page: 1,
  });
});

// init();

//  <link rel="stylesheet" href="./styles.css" />;
