import pgPromise from 'pg-promise'
const pgp = pgPromise({
  capSQL: true,
})
const dbConfig = {
  host: 'localhost',
  port: 5433,
  database: 'wad2231db',
  user: 'u20120220',
  password: 'U05V9S@m',
  schema: 's20220',
}

const db = pgp(dbConfig)

db.none('SET search_path TO ${schema:name}', dbConfig).catch((error) => {
  console.error('Error setting search path:', error)
})
export async function insertMovie(movie) {
  const query = `
    INSERT INTO Movies (id, title, year, image, genre, runtime, plot, director, imDbRating, imDbRatingCount)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
  `

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
  ]

  try {
    await db.none(query, values)
    console.log(`Inserted movie: ${movie.title}`)
  } catch (error) {
    console.error(`Error inserting movie ${movie.title}:`, error)
  }
}
export async function insertFavourite(favourite) {
  const query = `
    INSERT INTO Favourites (id, movie_id)
    VALUES ($1, $2);
  `

  const values = [favourite.id, favourite.movieId]

  try {
    await db.none(query, values)
    console.log(`Inserted favourite: ID ${favourite.id}`)
  } catch (error) {
    console.error(`Error inserting favourite ID ${favourite.id}:`, error)
  }
}

export async function deleteFavourite(movieId) {
  const query = ` DELETE FROM Favourites WHERE movie_id = $1; `
  try {
    await db.none(query, [movieId])
    console.log(`Deleted favourite: ID ${movieId}`)
  } catch (error) {
    console.error(`Error deleting favourite ID ${movieId}:`, error)
    throw error
  }
}
export async function fetchByMovieNameOrGenre(pattern) {
  const query = ` SELECT * FROM Movies WHERE genre ~* $1 OR title ~* $2; `
  try {
    const movies = await db.any(query, [pattern, pattern])
    return movies
  } catch (error) {
    console.error('Error searching movies by genre and title:', error)
    throw error
  }
}
export default db
