import { productsData } from "./products.js";

const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const addToCartBtns = document.querySelectorAll(".add-to-cart");

const productsDOM = document.querySelector(".products-center");

let cart = [];
// get products
class Products {
  // get from api end point !
  getProducts() {
    return productsData;
  }
}

// display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<section class="product">
      <div class="img-container">
        <img
          class="product-img"
          src= ${item.imageUrl}
          alt="p-1"
        />
      </div>
      <div class="product-desc">
        <p class="products-title">${item.title}</p>
        <p class="product-price">${item.price} &dollar;</p>
      </div>
      <button class="btn add-to-cart" data-id=${item.id}></i>add to cart</button>
    </section>`;
      productsDOM.innerHTML = result;
    });
  }
  getAddToCartBtn() {
    const addToCartBtns = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCartBtns];

    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      // check if this product id is in cart or not !
      const isInCart = cart.find((p) => p.id === id);
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // get product from products :
        const addedProduct = Storage.getProduct(id);
        // add to cart :
        cart = [...cart, { ...addedProduct, quantity: 1 }];
        // save cart to storage :
        Storage.saveCart(cart);
        // update cart value :
        // add to cart item
      });
    });
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
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
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
