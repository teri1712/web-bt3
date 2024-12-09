import pgPromise from "pg-promise";
const pgp = pgPromise({
  capSQL: true,
});
const dbConfig = {
  host: "localhost",
  port: 5433,
  database: "wad2231db",
  user: "u20120220",
  password: "U05V9S@m",
  schema: "s20220",
};

const db = pgp(dbConfig);

db.none("SET search_path TO ${schema:name}", dbConfig).catch((error) => {
  console.error("Error setting search path:", error);
});
export async function insertMovie(movie) {
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
export async function insertFavourite(movieId) {
  const query = `
    INSERT INTO Favourites (movie_id)
    VALUES ($1, $2);
  `;

  const values = [movieId];

  try {
    await db.none(query, values);
    console.log(`Inserted favourite: ID ${movieId}`);
  } catch (error) {
    console.error(`Error inserting favourite ID ${movieId}:`, error);
  }
}

export async function deleteFavourite(movieId) {
  const query = ` DELETE FROM Favourites WHERE movie_id = $1; `;
  try {
    await db.none(query, [movieId]);
    console.log(`Deleted favourite: ID ${movieId}`);
  } catch (error) {
    console.error(`Error deleting favourite ID ${movieId}:`, error);
    throw error;
  }
}
export async function getMovie(movieId) {
  let query = ` SELECT * FROM Movies WHERE id = $1; `;
  const movie = await db.one(query, [movieId]);

  movie.actorList = [];
  query = ` SELECT * FROM MovieActors WHERE movie_id = $1; `;
  const movieActors = await db.any(query, [movie.id]);
  for (let movieActor of movieActors) {
    const actorId = movieActor.actor_id;
    console.log(movieActor);
    query = ` SELECT * FROM Actors WHERE id = $1; `;
    const actor = await db.one(query, [actorId]);
    actor.asCharacter = movieActor.ascharacter;
    movie.actorList.push(actor);
  }
  query = ` SELECT * FROM Reviews WHERE movie_id = $1; `;
  movie.reviews = await db.any(query, [movie.id]);

  return movie;
}

export async function getActor(actorId) {
  let query = ` SELECT * FROM Actors WHERE id = $1; `;
  const actor = await db.one(query, [actorId]);

  query = ` SELECT * FROM MovieActors WHERE actor_id = $1; `;
  actor.movies = [];
  const movieActors = await db.any(query, [actor.id]);
  for (let movieActor of movieActors) {
    const movieId = movieActor.movie_id;
    query = ` SELECT * FROM Movies WHERE id = $1; `;
    const movie = await db.one(query, [movieId]);
    actor.movies.push(movie);
  }
  return actor;
}
export async function fetchByMovieNameOrGenre(pattern, page, per_page) {
  const offset = page * per_page;
  const limit = per_page;
  const query = ` SELECT * FROM Movies WHERE genre ~* $1 OR title ~* $2 OFFSET $3 LIMIT $4; `;
  const movies = await db.any(query, [pattern, pattern, offset, limit]);

  query = ` SELECT COUNT(*) FROM Movies WHERE genre ~* $1 OR title ~* $2`;
  actors.total_page = Math.ceil(
    parseInt((await db.one(query, [pattern])).count) / per_page
  );

  return movies;
}

export async function fetchByActorName(pattern, page, per_page) {
  const offset = page * per_page;
  const limit = per_page;

  let query = ` SELECT * FROM Actors WHERE name ~* $1 OFFSET $2 LIMIT $3;`;
  const actors = await db.any(query, [pattern, offset, limit]);

  query = `SELECT COUNT(*) FROM Actors WHERE name ~* $1;`;
  actors.total_page = Math.ceil(
    parseInt((await db.one(query, [pattern])).count) / per_page
  );
  return actors;
}
export async function fetchTopRating() {
  const query = `SELECT * FROM Movies ORDER BY rating DESC LIMIT 5;`;
  try {
    const movies = await db.any(query);
    return movies;
  } catch (error) {
    console.error("Error top rating:", error);
    throw error;
  }
}
export async function fetchTopRevenues() {
  const query = `SELECT * FROM Movies ORDER BY cumulative DESC LIMIT 15; `;
  try {
    const movies = await db.any(query);
    return movies;
  } catch (error) {
    console.error("Error top revenues:", error);
    throw error;
  }
}
export async function fetchTopFav() {
  const query = `SELECT * FROM Favourites ORDER BY id ASC LIMIT 15`;
  try {
    const movies = await db.any(query);
    return movies;
  } catch (error) {
    console.error("Error top revenues:", error);
    throw error;
  }
}

export default db;
