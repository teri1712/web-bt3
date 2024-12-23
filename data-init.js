import db from "./db.js";

async function insertMovie(movie) {
  const query = `
    INSERT INTO Movies (id, title, year, image, genre, runtime, plot, director, cumulative, rating)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    ON CONFLICT DO NOTHING;
  `;
  let cumulative = 0;
  if (movie.boxOffice && movie.boxOffice.cumulativeWorldwideGross) {
    const z = movie.boxOffice.cumulativeWorldwideGross.split("$");
    if (z.length == 2) {
      cumulative = parseInt(z[1].replace(",", ""));
      if (!cumulative) {
        cumulative = 0;
      }
    }
  }

  const values = [
    movie.id,
    movie.title,
    movie.year,
    movie.image,
    movie.genre,
    movie.runtimeStr,
    movie.plot,
    movie.director,
    cumulative,
    movie.ratings && movie.ratings.imDb ? parseFloat(movie.ratings.imDb) : 0,
  ];

  try {
    await db.none(query, values);
    console.log(`Inserted movie: ${movie.title}`);
  } catch (error) {
    console.error(`Error inserting movie ${movie.title}:`, error);
  }
}
async function insertActor(actor) {
  const query = `
    INSERT INTO Actors (id, name, image, role, summary)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT DO NOTHING;
  `;

  const values = [actor.id, actor.name, actor.image, actor.role, actor.summary];

  try {
    await db.none(query, values);
    console.log(`Inserted actor: ${actor.name}`);
  } catch (error) {
    console.error(`Error inserting actor ${actor.name}:`, error);
  }
}
async function insertMovieActor(movieId, actor) {
  const query = `
    INSERT INTO MovieActors (movie_id, actor_id, asCharacter)
    VALUES ($1, $2, $3) 
    ON CONFLICT DO NOTHING;
  `;

  const values = [movieId, actor.id, actor.asCharacter];

  try {
    await db.none(query, values);
    console.log(`Mapped actor ${actor.id} to movie ID ${movieId}`);
  } catch (error) {
    console.error(
      `Error mapping actor ${actor.id} to movie ID ${movieId}:`,
      error
    );
  }
}
async function insertReview(movieId, item) {
  const query = `
    INSERT INTO Reviews (movie_id, username, content)
    VALUES ($1, $2, $3) 
    ON CONFLICT DO NOTHING;
  `;

  const values = [movieId, item.username, item.content];

  try {
    await db.none(query, values);
    console.log(`Inserted review by ${item.username} for movie ID ${movieId}`);
  } catch (error) {
    console.error(`Error inserting review by ${item.username}:`, error);
  }
}

async function downloadData(path) {
  const response = await fetch(`http://matuan.online:2422/api/` + path);
  if (!response.ok) {
    window.alert(response.statusText);
    return;
  }
  const data = await response.json();
  console.log(path + ", " + data.length);
  return data;
}
const moviesData = downloadData("Movies");
const namesData = downloadData("Names");
const reviewsData = downloadData("Reviews");

async function saveMovies() {
  const movies = await moviesData;
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    movie.genre = "[" + movie.genreList.map((item) => item.key).join(",") + "]";
    movie.director =
      "[" + movie.directorList.map((item) => item.name).join(",") + "]";

    await insertMovie(movie);
    for (let i = 0; i < movie.actorList.length; i++) {
      await insertMovieActor(movie.id, movie.actorList[i]);
    }
  }
}
async function saveActors() {
  const actors = await namesData;
  for (let actor of actors) {
    await insertActor(actor);
  }
}
async function saveReviews() {
  const reviews = await reviewsData;
  for (let review of reviews) {
    for (let item of review.items) {
      insertReview(review.movieId, item);
    }
  }
}

export default async function init() {
  // await saveActors();
  // await saveMovies();
  await saveReviews();
}
