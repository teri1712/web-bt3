let light_mode = true;
function updateTheme(event) {
  event.preventDefault();
  light_mode = !light_mode;

  const header = document.getElementById("header");
  const mssv = document.getElementById("mssv");
  const movieInfo = document.getElementById("movie-Info");
  const lunar = document.getElementById("lunar-label");
  const switchButton = document.getElementById("switch_button");
  header.style.backgroundColor = !light_mode ? "darkred" : "rgb(241, 188, 188)";
  mssv.style.color = !light_mode ? "rgb(241, 188, 188)" : "grey";
  switchButton.checked = light_mode;
  movieInfo.style.color = !light_mode ? "rgb(241, 188, 188)" : "black";
  lunar.className = !light_mode ? "fa-solid fa-moon" : "fa-solid fa-gear";
  lunar.style.color = !light_mode ? "#ffd43b" : "black";
  document.documentElement.style.backgroundColor = light_mode
    ? "white"
    : "#2D2E31";

  const nav = document.getElementById("nav");
  const home = document.getElementById("home");
  const searchField = document.getElementById("search-movie-field");
  nav.style.backgroundColor = !light_mode ? "darkblue" : "lightblue";
  home.style.color = !light_mode ? "white" : "black";
  searchField.style.backgroundColor = light_mode ? "white" : "#2D2E31";
  searchField.style.color = light_mode ? "grey" : "white";

  const footer = document.getElementById("footer");
  footer.style.color = light_mode ? "black" : "white";

  const fling_section_names = document.getElementsByClassName("section-name");
  for (let i = 0; i < fling_section_names.length; i++) {
    fling_section_names[i].style.color = light_mode ? "black" : "white";
  }
}

function homeClicked() {
  window.location.href = "http://localhost:8080/";
}
function favClicked() {
  window.location.href = "http://localhost:8080/myFav";
}
function movieClicked(movieId) {
  console.log(movieId);
  window.location.href = "http://localhost:8080/movie?movieId=" + movieId;
}

function handleSearch(query, page) {
  if (page == -1) return;
  query = query.substring(0, query.indexOf("page="));
  window.location.href = "http://localhost:8080/" + query + "page=" + page;
}
