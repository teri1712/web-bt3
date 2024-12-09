function onStateChanged(obj) {
  const revenue = obj.revenue;
  const mainBook = revenue.getElementById("main-book");
  mainBook.src = obj.movies[obj.current_index].image;
  mainBook.style.opacity = obj.main_book_opacity;
  const dummyBook = revenue.getElementById("dummy-book");
  dummyBook.src = obj.movies[obj.dummy_index].image;
  dummyBook.style.opacity = obj.dummy_book_opacity;

  const title = revenue.getElementsByClassName("book-info-tile")[0];
  const genre = revenue.getElementsByClassName("book-info-genre")[0];
  const rating = revenue.getElementsByClassName("book-info-rating")[0];
  const runtime = revenue.getElementsByClassName("book-info-runtime")[0];

  title.textContent = obj.movies[obj.current_index].title;
  genre.textContent = obj.movies[obj.current_index].genre;
  rating.textContent = obj.movies[obj.current_index].imdbrating;
  runtime.textContent = obj.movies[obj.current_index].runtime;
}

function initRevenue() {
  const revenue = document.getElementById("revenue");
  const back = revenue.getElementById("back");
  const next = revenue.getElementById("next");
  const obj = {};
  obj.revenue = revenue;
  obj.current_index = 0;
  obj.movies = window.revenues;
  obj.dummy_book_interval = null;
  obj.dummy_index = 0;
  obj.dummy_book_opacity = 0;
  obj.main_book_opacity = 1;
  onStateChanged(obj);
  back.addEventListener("click", function () {
    switchPrevBook(obj);
  });
  next.addEventListener("click", function () {
    switchNextBook(obj);
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
  let current_time = 0;
  obj.dummy_book_interval = setInterval(() => {
    current_time += 20;
    if (current_time >= 500) {
      clearInterval(obj.dummy_book_interval);
      obj.dummy_book_interval = null;
    }
    obj.main_book_opacity = Math.min(1, current_time / 500);
    obj.dummy_book_opacity = Math.max(0, 1 - current_time / 500);
  }, 20);
}
function switchNextBook(obj) {
  let index = obj.current_index + 1;
  if (index === 5) {
    index = 0;
  }
  performSwitchBook(index);
}
function switchPrevBook(obj) {
  let index = obj.current_index - 1;
  if (index === -1) {
    index = 4;
  }
  performSwitchBook(index);
}
