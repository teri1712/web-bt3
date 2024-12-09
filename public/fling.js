function getDifWidth(fling) {
  return fling.getElementsByClassName("film-container")[0].style.width + 20;
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
    const zoomOut = fling.getElementById("zoom-out" + i);
    zoomOut.info_scale = 1;
    zoomOut.viewInfo = false;
    zoomOut.index = i;
    zoomOut.movies = obj.movies;
    zoomOut.addEventListener("mouseenter", function () {
      openViewInfo(zoomOut);
    });
    zoomOut.addEventListener("mouseleave", function () {
      closeViewInfo(zoomOut);
    });
    onViewInfoChanged(zoomOut);
  }
}
function onViewInfoChanged(obj) {
  const index = obj.index;
  const movie = obj.movies[obj.current_index + index];
  const bookImage = obj.getElementsByClassName("book-image")[0];
  const zoomInfo = obj.getElementsByClassName("zoom-info")[0];
  const zoomImage = obj.getElementsByClassName("zoom-book-image")[0];
  const title = obj.getElementsByClassName("book-title")[0];
  if (obj.viewInfo) {
    obj.appendChild(zoomInfo);
  } else {
    obj.removeChild(zoomInfo);
  }
  bookImage.src = movie.image;
  zoomImage.src = movie.image;
  zoomInfo.style.transform = "scale(" + obj.info_scale + ")";
  title.textContent = movie.title;
}
function onStateChanged(obj) {
  const fling = obj.fling;
  const film_container = fling.getElementsByClassName("film-container")[0];
  const film_fling = film_container.getElementsByClassName("film-fling")[0];
  const film_zoom =
    film_container.getElementsByClassName("zoom-out-film-list")[0];
  if (!obj.fling_visible) {
    film_container.removeChild(film_fling);
    film_container.appendChild(film_zoom);
  } else {
    film_container.removeChild(film_zoom);
    film_container.appendChild(film_fling);
  }
  film_fling.style.left = obj.fling_translation + "px";
  const fling_left = film_fling.getElementsByClassName("fling-left")[0];
  const fling_right = film_fling.getElementsByClassName("fling-right")[0];

  fling_left.style.visibility = obj.fling_left_visible ? "visible" : "hidden";
  fling_right.style.visibility = obj.fling_right_visible ? "visible" : "hidden";
  for (let i = 0; i < 6; i++) {
    document.getElementById("fling-clone" + i).src =
      obj.movies[obj.fling_index + i].image;
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
  onStateChanged(obj);
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
    onStateChanged(obj);
  }, 10);
}

function initFling(id, data_name) {
  let obj = {};
  obj.movies = window[data_name];
  obj.fling_interval = null;
  obj.current_index = -1;
  obj.fling_index = -1;
  obj.fling_visible = false;
  obj.fling_left_visible = true;
  obj.fling_right_visible = true;
  obj.fling_translation = 0;
  const fling = document.getElementById(id);
  const back = fling.getElementsByClassName("back")[0];
  const next = fling.getElementsByClassName("next")[0];
  obj.fling = fling;
  back.addEventListener("click", function () {
    performFling(obj, -3);
  });
  next.addEventListener("click", function () {
    performFling(obj, 3);
  });
  initInfoView(obj);
  onStateChanged(obj);
}
