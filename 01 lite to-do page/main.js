const input = document.querySelector('#new-todo')
const addBtn = document.querySelector('#add-btn')
const listPanel = document.querySelector('.list-panel')
const todoList = document.querySelector('#my-todo')
const doneList = document.querySelector('#done-list')
const emptyWarning = document.querySelector('#empty-warning')

//--------Original Data-------//
let todos = [
  "Hit the gym",
  "Read a book",
  "Buy eggs",
  "Organize office",
  "Pay bills"
];

for (let todo of todos) {
  addTodo(todo)
}

//------Create new task by clicking btn---------//
addBtn.addEventListener('click', submitInput)

//------Create new task by ENTER key---------//
input.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    submitInput()
  } 
})

//--------Delete or check tasks ---------//
listPanel.addEventListener('click', event => {
  let targetItem = event.target
  
  // delete task
  if (targetItem.classList.contains('delete')) {
    let selectedTask = targetItem.previousElementSibling.innerHTML
    let confirmation = confirm(`Are you sure you want to delete task '${selectedTask}' ?`)
    if (confirmation) {
      targetItem.parentElement.remove()
    } 
    
  // move task to finished list
  } else if (targetItem.classList.contains('in-progress')) {
    let doneTask = targetItem.innerHTML
    moveToDoneList(doneTask)
    targetItem.parentElement.remove()
  }
})

//-------------Functions---------------//
function submitInput () {
    if (input.value.trim().length > 0) {
    addTodo(input.value)
  } else (
    emptyWarning.classList.remove('d-none')
  )
}

function addTodo (task) {
  todoList.innerHTML += `
  <li>
    <label for="todo" class="in-progress">${task}</label>
    <i class="delete fa fa-trash"></i>
  </li>
  `
  input.value = ''
  emptyWarning.classList.add('d-none')
}

function moveToDoneList (doneTask) {
  doneList.innerHTML
  += `
  <li>
    <label for="todo" class="checked">${doneTask}</label>
    <i class="delete fa fa-trash"></i>
  </li>
  `
}