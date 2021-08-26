// ---------- variables declaration ------------- //
const base_URL = 'https://movie-list.alphacamp.io'
const index_URL = base_URL + '/api/v1/movies/'
const poster_URL = base_URL + '/posters/'
const movies_per_page = 12
const movies = []
let currentPage = 1
let filteredMovieList = []
let currentViewMode = 1 // View Mode Code : 0- list , 1- grid

// --------- element node selection -------- //
const moviePanel = document.querySelector('#movie-data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const modeSwitcher = document.querySelector('.view-mode-switcher')
const toastContainer = document.querySelector('#toast-container')

// ------- Display movie list -------- //
axios
  .get(index_URL)
  .then(response => {
    movies.push(...response.data.results) 
    displayMovies(getMoviesByPage(currentPage))
    renderPaginator(movies.length)
  })
  .catch(err => console.log('error'))

//--------- Listen to movie-panel --------- //
moviePanel.addEventListener('click', event => {
  if (event.target.matches('.btn-show-movie')){
    showMovieDetails(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// --------- Listen to view mode icons ---------- //
modeSwitcher.addEventListener('click', event => {
  const targetItem = event.target
  const listBtn = document.querySelector('#list-btn')
  const gridBtn = document.querySelector('#grid-btn')

  // change CSS style of mode buttons
  // 要怎麼增加點擊區域 不限定在 icon 本身
  if (targetItem.classList.contains('fa-bars')) {
    // active list mode
    currentViewMode = 0
    listBtn.classList.add('text-white')
    gridBtn.classList.remove('text-white')
  } else if (targetItem.classList.contains('fa-th-large')) {
    // active grid mode
    currentViewMode = 1 
    gridBtn.classList.add('text-white')
    listBtn.classList.remove('text-white')
  }
  // render movie according to the current mode
  displayMovies(getMoviesByPage(currentPage))
})

// ------- Listen to search input -------- //
searchForm.addEventListener('submit', event => {
  event.preventDefault() 
  const keyword = searchInput.value.trim().toLowerCase() 
  let compareResult = compareMovieList(keyword)

  currentPage = 1
  displayMovies(getMoviesByPage(currentPage))
  if (compareResult) {
    renderPaginator(filteredMovieList.length)
  } else if (!compareResult) {
     // When the user doesn't enter any keyword, restore related setting to default
    searchInput.value = ''
    renderPaginator(movies.length)
  }
})

// -------listen to the paginator------- //
paginator.addEventListener('click', event => {
  if (event.target.tagName === 'SPAN') {
    currentPage = Number(event.target.dataset.page)
    displayMovies(getMoviesByPage(currentPage))
    // regulate CSS style of page list
    for (let li of paginator.children) { li.classList.remove('active')}
    event.target.parentElement.classList.add('active')
  }
})

// -------------Listen to the close btn of toast -------------- //
toastContainer.addEventListener('click', event => {
  if (event.target.classList.contains('btn-close')) {
    event.target.parentElement.parentElement.remove()
  }
})

// ----------Functions------------ //
function displayMovies(data) {
  // check current selected mode and render movie-panel 
  // Hint: list-mode = 0 ; grid-mode = 1
  if (currentViewMode) {
    renderMovieGrid(data)
  } else if (!currentViewMode) {
    renderMovieList(data)
  }
}

function renderMovieGrid(data) {
  let rawHTML = ''

  data.forEach(item => {
    rawHTML += `
      <div class="col-sm-4 col-lg-3 mb-4">
        <div class="card h-100">
          <img src="${poster_URL + item.image}" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info text-light btn-add-favorite" data-id="${item.id}">Favorite ＋</button>
          </div>
        </div>
      </div>
    `
  })
  moviePanel.innerHTML = rawHTML
}

function renderMovieList(data) {
  let rawHTML = ''

  rawHTML += `<ul class="list-group list-group-flush mt-3 mb-5">`
  data.forEach(item => {
    rawHTML += `
      <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
        <div>${item.title}</div>
        <div>
          <button class="btn btn-sm ms-1 btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal"
            data-id="${item.id}"> More </button>
          <button class="btn btn-sm ms-1 btn-info text-light btn-add-favorite" data-id="${item.id}">Favorite ＋</button>
        </div>
      </li>
    `
  })
  rawHTML += `</ul>`
  moviePanel.innerHTML = rawHTML
}

function showMovieDetails(id) {
  axios
    .get(index_URL + id)
    .then(response => {
      insertDataToModal(response.data.results)
    })
    .catch(err => console.log('error'))
}

function insertDataToModal(data){
  const movieTitle = document.querySelector('#movie-modal-title')
  const movieImage = document.querySelector('#movie-modal-image')
  const movieDate = document.querySelector('#movie-modal-date')
  const movieDesc = document.querySelector('#movie-modal-description')

  movieTitle.innerText = data.title
  movieImage.innerHTML = `<img src="${poster_URL + data.image}" class="img-fluid" alt="Movie Poster">`
  movieDate.innerText = `Release Date: ${data.release_date}`
  movieDesc.innerText = data.description
}

function compareMovieList(keyword) {
  filteredMovieList = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))
  
  if (filteredMovieList.length === 0) {
    alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
    return false
  }
  return true
}

function addToFavorite(id) { 
  // check if there is an existing 'favorite list in the local storage
  const list = JSON.parse(localStorage.getItem('favoriteMovie'))|| [] 
  const favoriteMovie = movies.find(movie => movie.id === id)
  // confirm if this movie's already in the favorite list
  if (list.some(movie => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  // save this movie into favorite list in the local storage
  list.push(favoriteMovie)
  localStorage.setItem('favoriteMovie', JSON.stringify(list))
  // show success notification 
  notifyAddFavorite(favoriteMovie.title)
}

function getMoviesByPage(page) {
  const data = filteredMovieList.length ? filteredMovieList : movies
  const startIndex = (page - 1) * movies_per_page
  return data.slice(startIndex, startIndex + movies_per_page)
}

function renderPaginator (amount) {
  const numberOfPage = Math.ceil(amount / movies_per_page)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++ ){
    rawHTML += `
      <li class="page-item" aria-current="page"><span class="page-link" data-page="${page}">${page}</span></li>
    `
  }
  paginator.innerHTML = rawHTML
  paginator.firstElementChild.classList.add('active')
}

function notifyAddFavorite(title) {
  toastContainer.innerHTML += `
    <div class="toast align-items-center text-white bg-primary border-0 show" role="alert" aria-live="assertive"
    aria-atomic="true" id="toast-add-favorite">
      <div class="d-flex">
        <div class="toast-body">"${title}" is added to the favorite</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
          aria-label="Close"></button>
      </div>
    </div>
  `
}