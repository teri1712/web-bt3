function getDifWidth(fling) {
  return fling.querySelector(".film-container").clientWidth + 20;
}
function openViewInfo(obj) {
  if (obj.view_info_interval != null) {
    clearInterval(obj.view_info_interval);
  }
  obj.viewInfo = true;
  onViewInfoChanged(obj);
  obj.view_info_interval = setInterval(() => {
    const scale = obj.info_scale + 0.02;
    obj.info_scale = Math.min(1.2, scale);
    if (scale >= 1.2) {
      clearInterval(obj.view_info_interval);
      obj.view_info_interval = null;
    }
    onViewInfoChanged(obj);
  }, 20);
}
function closeViewInfo(obj) {
  if (obj.view_info_interval != null) {
    clearInterval(obj.view_info_interval);
  }
  obj.view_info_interval = setInterval(() => {
    const scale = obj.info_scale - 0.02;
    obj.info_scale = Math.max(1, scale);
    if (scale <= 1) {
      clearInterval(obj.view_info_interval);
      obj.view_info_interval = null;
      obj.viewInfo = false;
    }
    onViewInfoChanged(obj);
  }, 20);
}
function initInfoView(obj) {
  const fling = obj.fling;
  for (let i = 0; i < 3; i++) {
    const zoomOut = fling.querySelector(".zoom-out" + i);
    zoomOut.info_scale = 1;
    zoomOut.movies = obj.movies;
    zoomOut.viewInfo = false;
    zoomOut.index = i;
    zoomOut.movie = obj.movies[i];
    zoomOut.addEventListener("mouseenter", function () {
      openViewInfo(zoomOut);
    });
    zoomOut.addEventListener("mouseleave", function () {
      closeViewInfo(zoomOut);
    });
    zoomOut.addEventListener("click", function () {
      movieClicked(zoomOut.movie.id);
    });
    onViewInfoChanged(zoomOut);
  }
}
function onViewInfoChanged(obj) {
  const zoomInfo = obj.querySelector(".zoom-info");
  if (obj.viewInfo) {
    zoomInfo.style.display = "block";
  } else {
    zoomInfo.style.display = "none";
  }
  zoomInfo.style.transform = "scale(" + obj.info_scale + ")";
}
function onFlingStateChanged(obj) {
  const fling = obj.fling;

  const film_fling = obj.film_fling;
  const film_zoom = obj.film_zoom;
  for (let i = 0; i < 3; i++) {
    const zoomOut = film_zoom.querySelector(".zoom-out" + i);
    zoomOut.movie = obj.movies[obj.current_index + i];
    const movie = zoomOut.movie;
    const bookImage = zoomOut.querySelector(".book-image");
    const zoomImage = zoomOut.querySelector(".zoom-book-image");
    const title = zoomOut.querySelector(".book-title");
    bookImage.src = movie.image;
    zoomImage.src = movie.image;
    title.textContent = movie.title;
  }
  if (!obj.fling_visible) {
    film_fling.style.display = "none";
    film_zoom.style.display = "flex";
  } else {
    film_fling.style.display = "block";
    film_zoom.style.display = "none";

    film_fling.style.left = obj.fling_translation + "px";

    const fling_left = film_fling.querySelector(".fling-left");
    const fling_right = film_fling.querySelector(".fling-right");

    fling_left.style.visibility = obj.fling_left_visible ? "visible" : "hidden";
    fling_right.style.visibility = obj.fling_right_visible
      ? "visible"
      : "hidden";
    for (let i = 0; i < 6; i++) {
      fling.querySelector(".fling-clone" + i).src =
        obj.movies[obj.fling_index + i].image;
    }
  }
}
function performFling(obj, amount) {
  const index = obj.current_index + amount;

  if (index < 0 || index >= obj.movies.length || obj.fling_interval != null)
    return;
  obj.fling_index = amount < 0 ? index : obj.current_index;
  obj.current_index = index;
  obj.fling_visible = true;
  obj.fling_left_visible = true;
  obj.fling_right_visible = true;
  obj.fling_translation = amount > 0 ? 0 : -getDifWidth(obj.fling);
  onFlingStateChanged(obj);
  let current_time = 0;
  obj.fling_interval = setInterval(() => {
    current_time += 10;
    if (current_time == 200) {
      if (amount < 0) {
        obj.fling_right_visible = false;
      } else {
        obj.fling_left_visible = false;
      }
    }
    const coe = amount > 0 ? current_time : 400 - current_time;
    obj.fling_translation = -(coe * getDifWidth(obj.fling)) / 400;
    if (current_time === 400) {
      clearInterval(obj.fling_interval);
      obj.fling_visible = false;
      obj.fling_interval = null;
    }
    onFlingStateChanged(obj);
  }, 10);
}

function initFling(id, data_name) {
  const fling = document.getElementById(id);
  const back = fling.querySelector("#back");
  const next = fling.querySelector("#next");

  let obj = {};
  const movies = window[data_name];
  obj.movies = movies;
  obj.fling_interval = null;
  obj.current_index = movies.length == 0 ? -1 : 0;
  obj.fling_index = movies.length == 0 ? -1 : 0;
  obj.fling_visible = false;
  obj.fling_left_visible = false;
  obj.fling_right_visible = false;
  obj.fling_translation = 0;
  const film_fling = fling.querySelector(".film-fling");
  const film_zoom = fling.querySelector(".zoom-out-film-list");
  obj.film_fling = film_fling;
  obj.film_zoom = film_zoom;
  obj.fling = fling;
  if (obj.current_index != -1) {
    initInfoView(obj);
    onFlingStateChanged(obj);
    back.addEventListener("click", function () {
      performFling(obj, -3);
    });
    next.addEventListener("click", function () {
      performFling(obj, 3);
    });
  } else {
    fling.style.display = "none";
  }
}
