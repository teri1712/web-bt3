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
    INSERT INTO Movies (id, title, year, image, genre, runtime, plot, director, imDbRating, imDbRatingCount)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
  `;

  const values = [
    movie.id,
    movie.title,
    movie.year,
    movie.image,
    movie.genre,
    movie.runtime,
    movie.plot,
    movie.director,
    movie.imDbRating,
    movie.imDbRatingCount,
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
async function prepareMovie(movie) {
  let query = ` SELECT * FROM MovieActors WHERE movie_id = $1; `;
  movie.actorList = [];
  try {
    const movieActors = await db.any(query, [movie.id]);
    for (let movieActor of movieActors) {
      const actorId = movieActor.actor_id;
      query = ` SELECT * FROM Actors WHERE id = $1; `;
      try {
        const actor = await db.one(query, [actorId]);
        actor.asCharacter = movieActor.asCharacter;
        movie.actorList.push(actor);
      } catch (error) {
        console.error("Error actors by id:", actorId);
        throw error;
      }
    }
    return movie;
  } catch (error) {
    console.error("Error searching movies by genre and title:", error);
    throw error;
  }
}

async function prepareActor(actor) {
  let query = ` SELECT * FROM MovieActors WHERE actor_id = $1; `;
  actor.movies = [];
  try {
    const movieActors = await db.any(query, [actor.id]);
    for (let movieActor of movieActors) {
      const movieId = movieActor.movie_id;
      query = ` SELECT * FROM Movies WHERE id = $1; `;
      try {
        const movie = await db.one(query, [movieId]);
        actor.movies.push(movie);
      } catch (error) {
        console.error("Error actors by id:", movieId);
        throw error;
      }
    }
    return actor;
  } catch (error) {
    console.error("Error searching movies by genre and title:", error);
    throw error;
  }
}
export async function fetchByMovieNameOrGenre(pattern) {
  const query = ` SELECT * FROM Movies WHERE genre ~* $1 OR title ~* $2; `;
  try {
    const movies = await db.any(query, [pattern, pattern]);
    return movies.map((movie) => prepareMovie(movie));
  } catch (error) {
    console.error("Error searching movies by genre and title:", error);
    throw error;
  }
}
export async function fetchByActorName(pattern) {
  const query = ` SELECT * FROM Actors WHERE name ~* $1; `;
  try {
    const actors = await db.any(query, [pattern]);
    return actors.map((actor) => prepareActor(actor));
  } catch (error) {
    console.error("Error actors by name:", error);
    throw error;
  }
}
export default db;
