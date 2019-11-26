document.getElementById("date").innerHTML = new Date().getFullYear();

const cardTemplate = book => {
  const {
    volumeInfo: {
      title,
      description,
      authors,
      imageLinks: { thumbnail }
    }
  } = book;

  const cardElement = `<div class="col-md-4">
            <div class="card flex-row ">
             <div class="card-img-left book-image" style="background:url(${thumbnail}); background-repeat:no-repeat" ></div>
              <div class="book-body align-items-start">
                  <div class="book-title">${title}</div>
                  <div class="book-author">by ${authors[0]}</div>
                  <div class="book-text">${description}</div>
              </div>
            </div>`;
            
  return cardElement;
};

const genreStore = genre => {
  let genres;

  if (localStorage.getItem("genres")) {
    genres = JSON.parse(localStorage.getItem("genres"));
  } else {
    genres = [];
  }

  genres.unshift(genre);
  if (genres.length >= 5) {
    genres.pop();
  }
  localStorage.setItem("genres", JSON.stringify(genres));
  return genres;
};

const loadGenres = () => {
  const genres = JSON.parse(localStorage.getItem("genres"));
  return genres;
};

const loaderTemplate = `
    <div class="col-md-4">
    <div class="card flex-row  ">
        <svg
        role="img"
        aria-label="Loading interface..."
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
        style="
            height: 178px;
        "
        >
        <title>Loading interface...</title>
        <rect x="0" y="0" width="400" height="160" clip-path="url(#mjahugsjge)" style='fill: url("#hb6qsgxi39i");'></rect>
        <defs>
            <clipPath id="mjahugsjge">
            <rect x="70" y="11" rx="4" ry="4" width="117" height="6"></rect>
            <rect x="74" y="36" rx="3" ry="3" width="85" height="6"></rect>
            <rect x="85" y="61" rx="3" ry="3" width="274" height="4"></rect>
            <circle cx="30" cy="30" r="30"></circle>
            <rect x="0" y="1" rx="0" ry="0" width="63" height="140"></rect>
            <rect x="40" y="23" rx="0" ry="0" width="6" height="1"></rect>
            <rect x="86" y="75" rx="3" ry="3" width="274" height="4"></rect>
            <rect x="85" y="91" rx="3" ry="3" width="274" height="4"></rect>
            <rect x="86" y="105" rx="3" ry="3" width="274" height="4"></rect>
            </clipPath>
            <linearGradient id="hb6qsgxi39i">
            <stop offset="-1.27318" stop-color="#f3f3f3" stop-opacity="1">
                <animate
                attributeName="offset"
                values="-2; -2; 1"
                keyTimes="0; 0.25; 1"
                dur="2s"
                repeatCount="indefinite"
                ></animate>
            </stop>
            <stop offset="-0.273178" stop-color="#ecebeb" stop-opacity="1">
                <animate
                attributeName="offset"
                values="-1; -1; 2"
                keyTimes="0; 0.25; 1"
                dur="2s"
                repeatCount="indefinite"
                ></animate>
            </stop>
            <stop offset="0.726822" stop-color="#f3f3f3" stop-opacity="1">
                <animate
                attributeName="offset"
                values="0; 0; 3"
                keyTimes="0; 0.25; 1"
                dur="2s"
                repeatCount="indefinite"
                ></animate>
            </stop>
            </linearGradient>
        </defs>
        </svg>
    </div>
    </div>`;

const bookContainer = document.getElementById("suggestions");
const searchTitle = document.getElementById("searchTitle");
const searchQuery = document.getElementById("bookQuery");

const queryBooks = (query, suggested) => {
  if (suggested) {
    searchTitle.innerText = "Suggested Search";
  } else searchTitle.innerText = "";
  bookContainer.innerHTML = "";
  const queryStr = searchQuery.value || query;
  // Placeholders
  for (i = 0; i < 12; i++) {
    bookContainer.insertAdjacentHTML("beforeend", loaderTemplate);
  }
  const url = `https://www.googleapis.com/books/v1/volumes?q=${queryStr}`;
  setTimeout(() => {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          bookContainer.innerHTML = "Error request" + response;
        }
        return response;
      })
      .then(response => response.json())
      .then(function(data) {
        bookContainer.innerHTML = "";
        const dataStore = data.items;
        const item = dataStore.pop();
        if (item) {
          const {
            volumeInfo: { categories }
          } = item;
          const category = categories[0];
          genreStore(category);
        }
        const { items } = data;
        return items.map(item => {
          const suggestionHTML = cardTemplate(item);
          bookContainer.insertAdjacentHTML("beforeend", suggestionHTML);
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }, 3000);
};

window.addEventListener("load", e => {
  const lastFive = loadGenres();
  const randomGenre = lastFive[Math.floor(Math.random() * lastFive.length)];
  if (randomGenre) {
    queryBooks("the " + randomGenre, true);
  }
});

window.addEventListener("scroll", e => {
  const scrollTop = window.pageYOffset;
  // if (scrollTop >= 250) {
  if (scrollTop >= 50) {
    document.querySelector(".navbar").classList.add("opaque");
  } else document.querySelector(".navbar").classList.remove("opaque");
});
