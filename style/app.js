import { productsData } from "./products.js";

const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDOM = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");

let cart = [];
// get products
class Products {
  // get from api end point !
  getProducts() {
    return productsData;
  }
}
let buttonsDOM = [];

// display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="product">
      <div class="img-container">
        <img
          class="product-img"
          src= ${item.imageUrl}
        />
      </div>
      <div class="product-desc">
        <p class="products-title">${item.title}</p>
        <p class="product-price">${item.price} &dollar;</p>
      </div>
      <button class="btn add-to-cart" data-id=${item.id}>
      Add to cart
      </button>
    </div>`;
    });
    productsDOM.innerHTML = result;
  }
  getAddToCartBtn() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
    buttonsDOM = addToCartBtns;

    addToCartBtns.forEach((btn) => {
      const id = btn.dataset.id;
      // check if this product id is in cart or not !
      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerHTML = `In Cart`;
        event.target.disabled = true;
        // get product from products :
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };
        // add to cart :
        cart = [...cart, addedProduct];
        // save cart to storage :
        Storage.saveCart(cart);
        // update cart value :
        this.setCartValue(cart);
        // add to cart item :
        this.addCartItem(addedProduct);
        // get cart from storage :
      });
    });
  }
  setCartValue(cart) {
    // 1. update cart value
    // 2. add to cart item
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `total price : ${totalPrice.toFixed(2)} $`;
    cartItems.innerText = tempCartItems;
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img class="cart-item-img" src=${cartItem.imageUrl} />
              <div class="cart-item-desc">
                <h4>${cartItem.title}</h4>
                <h5>$ ${cartItem.price}</h5>
              </div>
              <div class="cart-item-controller">
                <i class="fas fa-arrow-up" data-id=${cartItem.id}></i>
                <p>${cartItem.quantity}</p>
                <i class="fas fa-arrow-down" data-id=${cartItem.id}></i>
              </div>
              <i class="fa-solid fa-trash-can" data-id=${cartItem.id}></i>`;
    cartContent.appendChild(div);
  }
  setupApp() {
    // get cart from storage :
    cart = Storage.getCart();
    // addCArtItem
    cart.forEach((cartItems) => this.addCartItem(cartItems));
    // setvalues : price + items
    this.setCartValue(cart);
  }
  cartLogic() {
    // clear cart :
    clearCart.addEventListener("click", () => this.clearCart());

    // cart functionality :
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-arrow-up")) {
        console.log(event.target.dataset.id);
        const addQuantity = event.target;
        // get item from cart
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addedItem.quantity++;
        // update cart value
        this.setCartValue(cart);
        // save cart
        Storage.saveCart(cart);
        // update cart item in UI
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      }
    });
  }
  clearCart() {
    // remove: (DRY) =>
    cart.forEach((cItem) => this.removeItem(cItem.id));
    // remove cart content children :
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  removeItem(id) {
    // update cart
    cart = cart.filter((cItem) => cItem.id !== id);
    // total price and cart items
    this.setCartValue(cart);
    // update storage
    Storage.saveCart(cart);

    // get add to cart btns => update text and disable
    this.getSingleButton(id);
  }
  getSingleButton(id) {
    const button = buttonsDOM.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "add to cart";
    button.disabled = false;
  }
}

// storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"))
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  // set up : get cart and set up app :
  const ui = new UI();
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});

// cart items modal
function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
