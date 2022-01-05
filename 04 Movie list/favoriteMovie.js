const base_URL = 'https://movie-list.alphacamp.io'
const index_URL = base_URL + '/api/v1/movies/'
const poster_URL = base_URL + '/posters/'
const movies_per_page = 12

const favMovies = JSON.parse(localStorage.getItem('favoriteMovie'))

const moviePanel = document.querySelector('#movie-data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// ------- Render movie list -------- //
renderMovieList(favMovies)

//--------- listen to movie panel --------- //
moviePanel.addEventListener('click', event => {
  if (event.target.matches('.btn-show-movie')){
    showMovieDetails(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFavorite(Number(event.target.dataset.id))
  }
})

// ----------Functions------------ //
function renderMovieList(data) {
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
            <button class="btn btn-danger text-light btn-remove-favorite" data-id="${item.id}"><i class="fas fa-heart"></i> X</button>
          </div>
        </div>
      </div>
    `
  })
  moviePanel.innerHTML = rawHTML ? rawHTML : `<h5>You haven't followed any favorite movies.</h5>`
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
  let filteredMovieList = []
  // if (!keyword.length) { return alert('Please enter a valid keyword')} 
  filteredMovieList = favMovies.filter((movie) => movie.title.toLowerCase().includes(keyword))
  
  if (filteredMovieList.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  renderMovieList(filteredMovieList)  
}

function removeFavorite(id) { 
  if (!favMovies) return

  const movieIndex = favMovies.findIndex(movie => movie.id === id)
  favMovies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovie', JSON.stringify(favMovies))
  renderMovieList(favMovies)
}

