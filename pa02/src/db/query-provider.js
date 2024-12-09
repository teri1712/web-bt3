async function downloadData(path) {
  const response = await fetch(`http://matuan.online:2422/api/` + path)
  if (!response.ok) {
    window.alert(response.statusText)
    return
  }
  const data = await response.json()
  console.log(path + ', ' + data.length)
  return data
}
let top5Revenue = null
const moviesData = downloadData('Movies')
const namesData = downloadData('Names')
const reviewsData = downloadData('Reviews')
const top50Data = downloadData('Top50Movies')
const popularsData = downloadData('MostPopularMovies')

function prepareMovie(movie) {
  movie.genre = '[' + movie.genreList.map((item) => item.key).join(',') + ']'
  movie.director = '[' + movie.directorList.map((item) => item.name).join(',') + ']'
  return movie
}

async function prepareActor(actor) {
  actor.movies = []
  const movies = await moviesData
  for (let i = 0; i < actor.castMovies.length; i++) {
    const movieId = actor.castMovies[i].id
    for (let j = 0; j < movies.length; j++) {
      if (movies[j].id === movieId) {
        actor.movies.push(prepareMovie(movies[j]))
        break
      }
    }
    console.log(movieId)
  }
}

async function prepareReviews(movie) {
  const reviews = await reviewsData
  let movie_reviews = []
  for (let i = 0; i < reviews.length; i++) {
    if (reviews[i].movieId === movie.id) {
      movie_reviews = reviews[i].items
      break
    }
  }
  movie.reviews = movie_reviews
}
async function findByMovieNameOrGenre(pattern) {
  const movies = await moviesData
  const filtered = []
  for (let i = 0; i < movies.length; i++) {
    let regex = new RegExp(pattern)
    if (regex.test(movies[i].title)) {
      prepareMovie(movies[i])
      filtered.push(movies[i])
    }
  }
  return filtered
}

async function handleSearchMovie(params, pattern) {
  const per_page = params.per_page
  const page = params.page
  const offset = (page - 1) * per_page
  const result = {}
  result.items = []
  result.per_page = per_page
  result.page = page
  result.search = pattern

  const movies = await findByMovieNameOrGenre(pattern)
  result.total_page = Math.ceil(movies.length / per_page)
  result.total = movies.length

  for (let i = offset; i < Math.min(movies.length, offset + per_page); i++) {
    result.items.push(movies[i])
  }

  return result
}

async function handleSearchAuthor(params, pattern) {
  const per_page = params.per_page
  const page = params.page
  const offset = (page - 1) * per_page
  const result = {}
  result.items = []
  result.per_page = per_page
  result.page = page
  result.search = pattern

  const names = await namesData

  const filtered = []
  for (let i = 0; i < names.length; i++) {
    let regex = new RegExp(pattern)
    if (regex.test(names[i].title)) {
      filtered.push(names[i])
    }
  }

  result.total_page = filtered.length / per_page
  result.total = filtered.length

  for (let i = offset; i < Math.min(filtered.length, offset + per_page); i++) {
    result.items.push(filtered[i])
  }
  return result
}
async function handleGetTop50(params) {
  const per_page = params.per_page
  const page = params.page
  const offset = (page - 1) * per_page
  const result = {}
  result.items = []
  result.per_page = per_page
  result.page = page

  const top50 = await top50Data
  result.total_page = top50.length / per_page
  result.total = top50.length

  for (let i = offset; i < Math.min(top50.length, offset + per_page); i++) {
    result.items.push(top50[i])
  }
  return result
}
async function handleGetPopular(params) {
  const per_page = params.per_page
  const page = params.page
  const offset = (page - 1) * per_page
  const result = {}
  result.items = []
  result.per_page = per_page
  result.page = page

  const populars = await popularsData
  result.total_page = populars.length / per_page
  result.total = populars.length

  for (let i = offset; i < Math.min(populars.length, offset + per_page); i++) {
    result.items.push(populars[i])
  }
  return result
}
async function handleGetTop5Revenue(params) {
  const per_page = params.per_page
  const page = params.page
  const result = {}
  result.items = []
  result.per_page = per_page
  result.page = page

  const movies = await moviesData
  if (top5Revenue == null) {
    top5Revenue = [...movies]
    top5Revenue.sort((a, b) => {
      let revenueA = !a.boxOffice
        ? -1
        : parseFloat(a.boxOffice.cumulativeWorldwideGross.replace(/[$,]/g, ''))
      let revenueB = !b.boxOffice
        ? -1
        : parseFloat(b.boxOffice.cumulativeWorldwideGross.replace(/[$,]/g, ''))
      return revenueB - revenueA
    })
    top5Revenue = top5Revenue.slice(0, 5)
    for (let i = 0; i < 5; i++) {
      prepareMovie(top5Revenue[i])
    }
  }
  result.items = top5Revenue
  return result
}
export default async function dbFetch(url) {
  const [path, query] = url.split('?')
  const [type, className, pattern] = path.split('/')
  const params = {}
  if (query) {
    query.split('&').forEach((param) => {
      const [key, value] = param.split('=')
      params[key] = value
    })
  }
  let result = {}
  if (type === 'search') {
    if (className === 'name') {
      result = handleSearchAuthor(params, pattern)
    } else if (className === 'movie') {
      result = handleSearchMovie(params, pattern)
    }
  }
  if (type === 'get') {
    if (className === 'top50') {
      result = handleGetTop50(params)
    } else if (className === 'mostpopular') {
      result = handleGetPopular(params)
    } else if (className === 'top5revenue') {
      result = handleGetTop5Revenue(params)
    }
  } else if (type === 'detail') {
    if (className === 'movie') {
      const movies = await moviesData

      result.id = pattern
      result.detail = null
      for (let i = 0; i < movies.length; i++) {
        if (movies[i].id === pattern) {
          prepareMovie(movies[i])
          prepareReviews(movies[i])
          result.detail = movies[i]
          break
        }
      }
    } else if (className === 'actor') {
      const actors = await namesData
      result.items = []
      for (let i = 0; i < actors.length; i++) {
        if (actors[i].id === pattern) {
          prepareActor(actors[i])
          result.detail = actors[i]
          break
        }
      }
    }
  }
  return result
}
