const menu = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const totalAmount = document.querySelector("#total-amount");
const btnSubmit = document.querySelector("#submit-button");

// ------------ Ｍenu Data ------------ //
let productData = [
  {
    id: "product-1",
    imgUrl:
      "https://images.unsplash.com/photo-1558024920-b41e1887dc32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "馬卡龍",
    price: 90
  },
  {
    id: "product-2",
    imgUrl:
      "https://images.unsplash.com/photo-1560691023-ca1f295a5173?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "草莓",
    price: 60
  },
  {
    id: "product-3",
    imgUrl:
      "https://images.unsplash.com/photo-1568271675068-f76a83a1e2d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "奶茶",
    price: 100
  },
  {
    id: "product-4",
    imgUrl:
      "https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "冰咖啡",
    price: 180
  }
];

// ----------- Display Menu ----------- //
for( let product of productData){
  updateMenu(product)
}

// ---------- Add product into shoppling cart ----------- //
menu.addEventListener('click', event => {
  let targetItem = event.target
  let product = targetItem.parentElement.firstElementChild
  
  if (targetItem.classList.contains('btn')) {
    updateShoppingCart(product)
    updateTotalAmount()
  }
})

// --------- Submit Order ---------- //
btnSubmit.addEventListener('click', event => {
  alertOrderDetail() 
  cart.innerHTML = ''
  totalAmount.innerText = "--"
})

// -------- All Functions ----------- //
function updateMenu(product) {
  menu.innerHTML += `
    <div class="col-3">
       <div class="card">
          <img src=${product.imgUrl} alt="product-image">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="productID d-none">${product.id}</p>
            <p class="card-text">${product.price}</p>
            <a href="#" class="btn btn-primary">加入購物車</a>
          </div>
        </div>
      </div>
  `
}

function updateShoppingCart(product) {
  let productID = product.nextElementSibling.innerText
  let unitPrice = product.nextElementSibling.nextElementSibling.innerText
  
  if (checkIfItemExistInCart(productID)) {
    updateQty(product, productID)
  } else {
    addProductToCart(product, productID)
  }
}

function checkIfItemExistInCart(productID){
  let cartList = document.querySelectorAll('.cart-list-item')
  let checkResult = false
  
  // check cart items one by one 
  // Note: some() Method can't be use in the DOM node list,which is not an JS array!
  cartList.forEach(item => {
    if (item.id === productID) {
      checkResult = true
    }
  })
  return checkResult
}

function updateQty(product, productID) {
  let unitPrice = product.nextElementSibling.nextElementSibling.innerText
  let spanQty = document.querySelector(`#${productID}`).firstElementChild
  let spanSubtotal = document.querySelector(`#${productID}`).lastElementChild
  newQty = Number(spanQty.innerText) + 1
  newAmount = newQty * unitPrice
  spanQty.innerText = newQty
  spanSubtotal.innerText = newAmount
}

function addProductToCart(product, productID) {
  let unitPrice = product.nextElementSibling.nextElementSibling.innerText
  cart.innerHTML += `
    <li class="cart-list-item list-group-item" id="${productID}">${product.innerText} x <span class="qty">1</span>，小計：<span class="subtotal">${unitPrice}</span> 元</li>
  `
}

function updateTotalAmount() {
  let subTotal = document.querySelectorAll('.subtotal')
  let total = 0
  // add up all subtotal
  subTotal.forEach(item => {
    amount = Number(item.innerText)
    total += amount
  })
  totalAmount.innerText = total
}

function alertOrderDetail() {
  let cartList = document.querySelectorAll('.cart-list-item')
  let information = ''
  const newLine = '\n'
  
  if (totalAmount.innerText.length > 0) {
    cartList.forEach(item => {
      information += newLine
      information += '- '
      information += item.innerText
    })
    alert(`感謝購買！ 購買清單如下：${information} \n總金額：${totalAmount.innerText} 元`)
  } else {
    alert('購物車內無點餐紀錄，請再次確認！')
  }
}