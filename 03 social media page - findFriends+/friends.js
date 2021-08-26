// ---------- variables declaration ------------- //
const base_URL = 'https://lighthouse-user-api.herokuapp.com'
const index_URL = base_URL + '/api/v1/users/'

let friends = JSON.parse(localStorage.getItem('connectionList'))
const usersPerPage = 4
let totalPages
let currentPage = 1
let filteredFriends = []

// --------- element node selection -------- //
const cardBody = document.querySelector('#card-body')
const userPanel = document.querySelector('#user-panel')
const modalTitle = document.querySelector('.modalTitle')
const modalImg = document.querySelector('#modal-img')
const modalInfo = document.querySelector('#modalInfo')
const disconnectBtn = document.querySelector('#disconnect-btn')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const pageList = document.querySelector('#page-list')
const paginatorTotalPages = document.querySelector('#total-pages')
const toastConnect = document.querySelector('#toast-disconnection')
const toastContainer = document.querySelector('#toast-container')

//------- display friends into user-panel  ------- //
  countTotalPages(friends)
  showUsersList(currentPage)
  renderPagination(currentPage) 

// --------Listen to the card body--------- //
cardBody.addEventListener('click', event => {
  const targetItem = event.target

  // show modal
  if (targetItem.tagName === 'IMG') {
    const id = Number(targetItem.parentElement.dataset.id)
    insertInfoToModal(id)
  // turn page
  } else if (targetItem.matches('.previous-button') && currentPage > 1) {
    backToPreviousPage()
  } else if (targetItem.matches('.next-button') && currentPage < totalPages) {
    goToNextPage()
  } 
})

// --------- Listen to the pagination -------- //
pageList.addEventListener('click', event => {
    event.preventDefault()
    let goToPage = Number(event.target.innerText)
    // confirm whether the user clicks the page number or arrow icons
    // 需要先確認點擊的是符號還是頁碼，因為兩個箭頭 << >> 不是數字，goToPage 回傳值為isNaN
    if (isNaN(goToPage)) {
      if (event.target.classList.contains('previous-button') && currentPage > 1) {
        backToPreviousPage()
      } else if (event.target.classList.contains('next-button') && currentPage < totalPages) {
        goToNextPage()
      }
    } else if (goToPage > 0 && goToPage <= totalPages) {
      currentPage = goToPage   
      showUsersList(goToPage)
      renderPagination(goToPage) 
    }
})

// ------- Listen to the search submit --------- //
searchForm.addEventListener('submit', event => {
  event.preventDefault() // 一開始是監聽 btn，所以 preventDefault 怎麼樣都起不了作用

  let keyword = searchInput.value.trim().toLowerCase()

  if (keyword.length === 0 || !compareKeyword(keyword)) {
    // When the user doesn't enter any keyword, restore related setting to default
    searchInput.value = ''
    filteredFriends = []
    countTotalPages(friends)
  } else if (compareKeyword(keyword)){
    // show results of comparing keyword
    countTotalPages(filteredFriends)
  }
    currentPage = 1
    showUsersList(currentPage)
    renderPagination(currentPage) 
})

// ------- Listen to modal disconnection-btn --------- //
disconnectBtn.addEventListener('click', event => {
  removeFriends(Number(disconnectBtn.dataset.id))
  disconnectBtn.nextElementSibling.click()
})

// -------------Listen to the close btn of toast -------------- //
toastContainer.addEventListener('click', event => {
  if (event.target.classList.contains('btn-close')) {
    event.target.parentElement.parentElement.remove()
  }
})

// --------- Functions ------------ //
function countTotalPages(userList) {
  let numOfUser = userList.length
  return totalPages  = Math.ceil(numOfUser / usersPerPage)
}

function showUsersList(page) {
  const data = filteredFriends.length ? filteredFriends : friends // 重點！！！！！！！！！
  let startIndex = (page - 1) * usersPerPage
  let displayingUsers

  if (data.length <= usersPerPage) {
    displayingUsers = data
  } else {
    displayingUsers = data.slice(startIndex, startIndex + usersPerPage)
  }
  renderUserList(displayingUsers)
}

function renderUserList(data) {
  let rawHTML = ''
  data.forEach(user => { 
    rawHTML += `
      <div class="col-6 col-sm-3 text-center">
        <a href="#" data-bs-toggle="modal" data-bs-target="#profile-modal"
        data-id="${user.id}">
          <img src="${user.avatar}" class="img-fluid border border-light shadow-sm my-2 rounded-circle"
          alt="avatar">
        </a>
      </div>
    `
  })
  userPanel.innerHTML = rawHTML
}

function insertInfoToModal(id) {
  const modalTitle = document.querySelector('.modal-title')
  const modalImg = document.querySelector('#modal-img')
  const modalInfo = document.querySelector('#modal-info')
  
  axios
    .get(index_URL + id)
    .then(response => {
      const data = response.data
      modalTitle.innerHTML = `<i class="far fa-smile-wink"></i>  ${data.name} ${data.surname}`
      modalImg.src = data.avatar
      modalInfo.innerHTML = `
        <p class="text-capitalize">・Gender: ${data.gender} <br>・Age: ${data.age} <br>・Region: ${data.region} <br>・birthday: ${data.birthday}</p>
        <p>
          ・<i class="fas fa-envelope"></i> Email: <a href="mailto:${data.email}"> ${data.email}</a>
        </p>
      `
      disconnectBtn.dataset.id = `${data.id}`
    })
    .catch(err => console.log('error'))
}

function renderPagination(page) {
  let rawHTML = ''

  rawHTML = `
      <li class="page-item previous-button">
        <a class="page-link previous-button" href="#" aria-label="Previous" aria-disabled="false">&laquo;</a>
      </li>
      <li class="page-item"><a class="page-link" href="#" aria-disabled="true">${page - 1}</a></li>
      <li class="page-item active" aria-current="page"><a class="page-link" href="#">${page}</a></li>
      <li class="page-item"><a class="page-link" href="#">${page + 1}</a></li>
      <li class="page-item next-button">
        <a class="page-link next-button" href="#" aria-label="Next">&raquo;</a>
      </li>    
    `
  pageList.innerHTML = rawHTML
  paginatorTotalPages.innerText = `Total Pages: ${totalPages}`
  // clear special setting of first and last page
  removeDisplayNoneState()

  // special style setting for first and last page
  if (currentPage === 1) {
    disableTurnPreviousBtn()
  } 
  if (currentPage === totalPages) {
    disableTurnNextBtn() 
  }
}

function backToPreviousPage() {
  currentPage--
  showUsersList(currentPage)
  renderPagination(currentPage) 
}

function goToNextPage() {
  currentPage++
  showUsersList(currentPage)
  renderPagination(currentPage) 
}

function disableTurnPreviousBtn() {
  const previousBtns = document.querySelectorAll('.previous-button')
  const previousPage = pageList.firstElementChild.nextElementSibling
  previousBtns.forEach(btn => btn.classList.add('d-none'))
  previousPage.classList.add('d-none')
}

function disableTurnNextBtn() {
  const nextBtns = document.querySelectorAll('.next-button')
  const nextPage = pageList.lastElementChild.previousElementSibling
  nextBtns.forEach(btn => btn.classList.add('d-none'))
  nextPage.classList.add('d-none')
}

function removeDisplayNoneState() {
  const previousBtns = document.querySelectorAll('.previous-button')
  const nextBtns = document.querySelectorAll('.next-button')
  previousBtns.forEach(btn => btn.classList.remove('d-none'))
  nextBtns.forEach(btn => btn.classList.remove('d-none'))
}

function compareKeyword(keyword) {
  // compare keyword to data of first name, last name, region and gender
  const matchedName = friends.filter(user => user.name.toLowerCase().includes(keyword)) // Dom : contains. JS: includes
  const matchedSurname = friends.filter(user => user.surname.toLowerCase().includes(keyword)) 
  const matchedRegion = friends.filter(user => user.region.toLowerCase().includes(keyword))
  const matchedGender = friends.filter(user => user.gender.toLowerCase() === keyword)
  filteredFriends = matchedName.concat(matchedSurname, matchedRegion, matchedGender)

  // Confirm whether the keyword is found in the data
  if (filteredFriends.length === 0){
    alert('User not found!')
    return false
  }
  return true
}

function removeFriends(id) {
  const targetIndex = friends.findIndex(user => user.id === id)
  let targetUser = friends.splice(targetIndex, 1)
  // delete the user from friend list and update the view
  localStorage.setItem('connectionList', JSON.stringify(friends))
  countTotalPages(friends)
  showUsersList(currentPage)
  renderPagination(currentPage) 
  // show success notification
  notifyConnect(targetUser[0].name)
}

function notifyConnect(name) {
  toastContainer.innerHTML += `
    <div class="toast align-items-center text-white bg-danger border-0 show" role="alert" aria-live="assertive"
    aria-atomic="true" id="toast-disconnection">
      <div class="d-flex">
        <div class="toast-body">
          ${name} is removed from list. <i class="fas fa-user-friends"></i>x
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
          aria-label="Close"></button>
      </div>
    </div>
  `
}