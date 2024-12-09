function onRatingStateChanged(obj) {
  const topRating = obj.topRating;
  const mainBook = topRating.querySelector("#main-book");
  mainBook.src = obj.movies[obj.current_index].image;
  mainBook.style.opacity = obj.main_book_opacity;

  const dummyBook = topRating.querySelector("#dummy-book");
  dummyBook.src = obj.movies[obj.dummy_index].image;
  dummyBook.style.opacity = obj.dummy_book_opacity;

  const title = topRating.querySelector(".book-info-title");
  const genre = topRating.querySelector(".book-info-genre");
  const rating = topRating.querySelector(".book-info-rating");
  const runtime = topRating.querySelector(".book-info-runtime");

  title.textContent = obj.movies[obj.current_index].title;
  genre.textContent = obj.movies[obj.current_index].genre;
  rating.textContent = obj.movies[obj.current_index].imdbrating;
  runtime.textContent = obj.movies[obj.current_index].runtime;
}

function initTopRating() {
  const topRating = document.getElementById("top-rating");
  const back = topRating.querySelector("#back");
  const next = topRating.querySelector("#next");
  const obj = {};
  obj.topRating = topRating;
  obj.current_index = 0;
  obj.movies = window.TOP_RATING;
  obj.dummy_book_interval = null;
  obj.dummy_index = 0;
  obj.dummy_book_opacity = 0;
  obj.main_book_opacity = 1;

  onRatingStateChanged(obj);
  back.addEventListener("click", function () {
    switchPrevBook(obj);
  });
  next.addEventListener("click", function () {
    switchNextBook(obj);
  });
  topRating.querySelector("#show-book").addEventListener("click", function () {
    movieClicked(obj.movies[obj.current_index].id);
  });
}

function performSwitchBook(obj, index) {
  obj.dummy_index = obj.current_index;
  obj.current_index = index;

  obj.dummy_book_opacity = 1;
  obj.main_book_opacity = 0.2;
  if (obj.dummy_book_interval != null) {
    clearInterval(obj.dummy_book_interval);
  }
  onRatingStateChanged(obj);

  let current_time = 0;
  obj.dummy_book_interval = setInterval(() => {
    current_time += 20;
    if (current_time >= 500) {
      clearInterval(obj.dummy_book_interval);
      obj.dummy_book_interval = null;
    }
    obj.main_book_opacity = Math.min(1, current_time / 500);
    obj.dummy_book_opacity = Math.max(0, 1 - current_time / 500);
    onRatingStateChanged(obj);
  }, 20);
}
function switchNextBook(obj) {
  let index = obj.current_index + 1;
  if (index === 5) {
    index = 0;
  }
  performSwitchBook(obj, index);
}
function switchPrevBook(obj) {
  let index = obj.current_index - 1;
  if (index === -1) {
    index = 4;
  }
  performSwitchBook(obj, index);
}
