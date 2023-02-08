const IMAGE_PATH = "./img";
const products = [...items];
let cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
let currentProducts = products;
const saveData = () => localStorage.setItem('cartProducts', JSON.stringify(cartProducts));

function initSlider() {
  const slider = new Swiper(".swiper", {
    autoplay: {
      delay: 6000,
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    loop: true,
  });

  return slider;
}

function sortProductsByOrder(type) {
  const inAscendingOrder = [...products].sort((p1, p2) => p1.price - p2.price);
  const inDescendingOrder = [...products].sort((p1, p2) => p2.price - p1.price);

  switch (type) {
    case 'asc':
      renderCards(inAscendingOrder);
      break;
    case 'desc':
      renderCards(inDescendingOrder);
      break;
    default:
      renderCards(products);
  }
}

function initSort() {
  const orderSort = document.querySelector(".js-catalog-sort-order");

  if (!orderSort) {
    return;
  }

  const options = [...orderSort.querySelectorAll(".js-sort")];

  options.forEach((option) => {
    const { value: sortType } = option;

    option.addEventListener("click", () => {
      const rest = options.filter((node) => node !== option);
      rest.forEach((node) =>
        node.classList.remove("catalog-dropdown__option--selected")
      );

      option.classList.add("catalog-dropdown__option--selected");

      sortProductsByOrder(sortType);
    });
  });
}

function initDropdown() {
  const dropdowns = [...document.querySelectorAll(".js-catalog-dropdown")];

  if (!dropdowns.length) {
    return;
  }

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".js-catalog-dropdown-trigger");

    trigger.addEventListener("click", () => {
      const rest = dropdowns.filter((node) => node !== dropdown);
      rest.forEach((node) =>
        node.classList.remove("catalog-dropdown--is-active")
      );

      dropdown.classList.toggle("catalog-dropdown--is-active");
    });

    window.addEventListener("click", (event) => {
      if (!event.target.closest(".js-catalog-dropdown")) {
        if (dropdown.classList.contains("catalog-dropdown--is-active")) {
          dropdown.classList.remove("catalog-dropdown--is-active");
        }
      }
    });
  });
}

function openProductModal(id) {
  const modal = document.querySelector('.product-modal');
  const overlay = modal.querySelector('.product-modal__overlay');
  modal.classList.add('js-product-root');
  modal.id = id;
  const productToRender = products.find((product) => product.id === +id);
  const { name, color, chip, os, imgUrl, size, price, orderInfo, orderCount } = productToRender;

  const { name: chipName } = chip;
  const { width, height, depth, weight } = size;

  const prodImg = modal.querySelector('.product-modal__image');
  const prodName = modal.querySelector('.product-modal__name');
  const prodColor = modal.querySelector('.product-modal__prodcolor');
  const prodOs = modal.querySelector('.product-modal__prodos');
  const prodChip = modal.querySelector('.product-modal__prodchip');
  const prodHeight = modal.querySelector('.product-modal__prodheight');
  const prodWidth = modal.querySelector('.product-modal__prodwidth');
  const prodDepth = modal.querySelector('.product-modal__proddepth');
  const prodWeight = modal.querySelector('.product-modal__prodweight');
  const prodTotal = modal.querySelector('.product-modal__total');
  const prodStock = modal.querySelector('.product-modal__stock');
  const prodReviews = modal.querySelector('.product-modal__reviews-percentage');
  const prodOrders = modal.querySelector('.product-modal__order-count');


  prodImg.src = `${IMAGE_PATH}/${imgUrl}`;

  prodName.innerText = name;
  prodColor.innerText = color.length > 1 ? color.join(', ') : color.toString();
  prodChip.innerText = chipName;
  prodOs.innerText = os ?? '-';
  prodHeight.innerText = `${height} cm`;
  prodWidth.innerText = `${width} cm`;
  prodDepth.innerText = `${depth} cm`;
  prodWeight.innerText = `${weight * 1000} g`;
  prodTotal.innerText = price;
  prodStock.innerText = orderInfo.inStock;
  prodReviews.innerText = `${orderInfo.reviews}%`;
  prodOrders.innerText = orderCount;

  if (orderInfo.reviews > 50) {
    modal.classList.add('product-modal--highly-reviewed');
  } else {
    modal.classList.remove('product-modal--highly-reviewed');
  }

  modal.classList.add('product-modal--is-visible');
  document.body.classList.add('is-locked');

  overlay.addEventListener('click', (event) => {
    if (!(event.target.classList.contains('.product-modal__inner'))) {
      modal.classList.remove('product-modal--is-visible');
      document.body.classList.remove('is-locked');
    }
  });
}

function initAddToCart() {
  document.addEventListener('click', ({ target }) => {
    if (target.classList.contains('js-add-to-cart')) {
      const cardNode = target.closest(".js-product");
      const { prodid } = cardNode.dataset;

      openProductModal(prodid);
    }
  });
};

function renderCards(products) {
  const parent = document.querySelector(".js-catalog-product-list");
  parent.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const proto = document.querySelector(".js-catalog-product-proto");

  products.forEach((item) => {
    const { name, imgUrl, orderInfo, price: itemPrice } = item;
    item.orderCount = ((Math.random() * 1000) | 0).toString();
    const li = document.createElement("li");
    li.id = item.id;
    li.classList.add("catalog__item");
    const card = proto.cloneNode(true);
    card.classList.remove('js-catalog-product-proto');
    const title = card.querySelector(".catalog-card__link");
    const image = card.querySelector(".catalog-card__image");
    const quantity = card.querySelector(".catalog-card__stock-quantity");
    const price = card.querySelector(".catalog-card__price");
    const action = card.querySelector(".catalog-card__action");
    const reviews = card.querySelector(".catalog-card__reviews-percentage");
    const orderCount = card.querySelector(".catalog-card__order-count");

    title.innerText = name;
    image.src = `${IMAGE_PATH}/${imgUrl}`;
    image.alt = name;
    quantity.innerText = orderInfo.inStock;
    price.innerText = itemPrice;
    reviews.innerText = `${orderInfo.reviews}%`;
    orderCount.innerText = item.orderCount;

    card.setAttribute('data-prodid', item.id);

    if (orderInfo.inStock === 0) {
      card.classList.add("catalog-card--unavailable");
      action.disabled = true;
    }

    if (orderInfo.reviews > 50) {
      card.classList.add("catalog-card--highly-reviewed");
    }

    li.append(card);
    fragment.append(li);
  });

  parent.append(fragment);
  initAddToCart(parent);
}

function initProductList() {
  renderCards(items);
}

function initAccordionList() {
  const accordionList = document.querySelector(".js-accordion-list");
  const accordions = accordionList.querySelectorAll(".js-accordion");

  accordions.forEach((accordion) => {
    const controls = accordion.querySelector(".accordion__controls");
    const content = accordion.querySelector(".accordion__content");

    controls.addEventListener("click", () => {
      accordion.classList.toggle("accordion--active");

      if (accordion.classList.contains("accordion--active")) {
        content.style.maxHeight = `${content.scrollHeight}px`;
      } else {
        content.style.maxHeight = '0';
      }
    });
  });
}

function filterAndRerenderProducts(type, value) {
  currentProducts = products;
  const errorMsg = document.querySelector('.js-catalog-error');

  const isNum = (val) => !isNaN(parseFloat(val));


  const filteredList = currentProducts.filter((product) => {
    const filter = product[type];

    if (Array.isArray(filter)) {
      const parsedArr = filter.map((val) => val.toLowerCase().trim());

      return parsedArr.includes(value);
    }

    // if (typeof filter === 'Number' && Number.isInteger()) {
    // }

    if (isNum(value) && typeof filter === 'number') {

      return Number(value) === filter;
    }

    // console.log({filter, value})
  });

  if (!filteredList.length) {
    console.log(true);
    currentProducts = [];
    errorMsg.classList.add('catalog__error--visible');
  } else {
    console.log(filteredList);
    errorMsg.classList.remove('catalog__error--visible');
    currentProducts = filteredList;
  }
  renderCards(currentProducts);
}

function categoriesHandler() {
  const select = document.querySelector('.js-category-sort');

  select.addEventListener('change', ({ target }) => {
    if (target.value !== 'all') {
      currentProducts = products.filter(item => item.category.toLowerCase() === target.value);
      renderCards(currentProducts);
    } else {
      renderCards(products);
    }
  })
}

function initFilter() {
  const filters = document.querySelector('.js-catalog-filter');
  const inputs = [...filters.querySelectorAll('input')];

  inputs.forEach((input) => {
    const { name: filterType, value } = input;

    input.addEventListener('change', () => {
      filterAndRerenderProducts(filterType, value);
    });
  });
}

function cartToggle() {
  const cartTrigger = document.querySelector('.js-cart-trigger');
  const cart = document.querySelector('.cart');

  if (!cart) return;

  cartTrigger.addEventListener('click', () => {
    cart.classList.toggle('cart--is-active');
  });
}

function getIdAndAddProdToCard(target) {
  const { id } = target.closest('.js-product-root');
  const currentProduct = products.find((product) => +product.id === +id);
  const hasSameItem = cartProducts.find((item) => +item.id === +id);

  if (!hasSameItem) {
    currentProduct.cartCount = 1;
    cartProducts.push(currentProduct);
  } else {
    cartProducts.forEach((item) => {
      if (item.id === +id) {
       item.cartCount++;
      }
    });
  }
  saveData();
  cartUpdate();
}

function addEventForButton(button) {
  button.addEventListener('click', ({ target }) => getIdAndAddProdToCard(target));
}

function findButtonsAddProductToCart() {
  const buttonsAddToCart = [...document.querySelectorAll('.js-add-to-cart-button')];

  if (!buttonsAddToCart.length) return;

  buttonsAddToCart.forEach((button) => addEventForButton(button));
}

function cartUpdate() {
  if (!cartProducts) {
    cartProducts = [];
  } else {
    const cartList = document.querySelector('.js-product-cart-list');
    const fragment = document.createDocumentFragment();
    const protoProduct = document.querySelector(".js-proto-cart-product");
    cartList.innerHTML = '';

    cartProducts.forEach((product) => {
      const {id, cartCount, imgUrl, price, name} = product;
      const card = protoProduct.cloneNode(true);
      card.classList.remove('cart-product--proto', 'js-proto-cart-product');
      card.id = `cart-${id}`;
      card.classList.add('js-product-root');
      card.querySelector('img').src = `${IMAGE_PATH}/${imgUrl}`;
      card.querySelector('.cart-product__title').textContent = name;
      card.querySelector('.js-cart-product-price').textContent = `${price * cartCount}`;
      card.querySelector('.js-count').textContent = cartCount;
      fragment.append(card);
    })
    cartList.append(fragment);
  }
  setValues();
}

function removeItem(rootElement) {
  cartProducts = cartProducts.filter((item) => `cart-${item.id}` !== rootElement.id);
  rootElement.remove();
  saveData();
  cartUpdate();
  setValues();
}

function updateValuesInCart({ id }, operation) {
  cartProducts.forEach((product) => {
    if (`cart-${product.id}` === id && operation === 'minus') {
      if (product.cartCount !== 1) product.cartCount -= 1;
    }

    if (`cart-${product.id}` === id && operation === 'plus') {
      product.cartCount += 1;
    }
  })
  saveData();
  setValues();
}

function setValues() {
  const cart = document.querySelector('.cart');
  const totalCountElement = cart.querySelector('.js-total-count');
  const totalPriceElement = cart.querySelector('.js-total-price');
  cartProducts.forEach((product) => {
    const { id, cartCount, price} = product;
    const card = cart.querySelector(`#cart-${id}`);
    card.querySelector('.js-cart-product-price').textContent = `${price * cartCount}`;
    card.querySelector('.js-count').textContent = cartCount;
  })
  const totalCount = cartProducts.map(({ cartCount }) => cartCount);
  const sumTotalCount = totalCount.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const totalSum = cartProducts.map((product) => product.cartCount * product.price);
  const sumTotalPrice = totalSum.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  totalCountElement.textContent = `${sumTotalCount} ptc.`;
  totalPriceElement.textContent = `${sumTotalPrice} ptc.`;
}

function setClicksForButtonsInCart() {
  const cartProductsList = document.querySelector('.js-product-cart-list');

  cartProductsList.addEventListener('click', ({ target }) => {
    const rootElement = target.closest('.js-product-root');

    if (target.classList.contains('js-remove-product')) {
      removeItem(rootElement)
    }

    if (target.classList.contains('js-dicrease-product')) {
      updateValuesInCart(rootElement, 'minus');
    }

    if (target.classList.contains('js-increase-product')) {
      updateValuesInCart(rootElement, 'plus');
      // removeItem(target)
    }
  });
}

function cartHandler() {
  cartToggle();
  findButtonsAddProductToCart();
  cartUpdate();
  setClicksForButtonsInCart();
  setValues();
}

document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  initDropdown();
  initSort();
  initProductList();
  initAccordionList();
  initFilter();
  cartHandler();
  categoriesHandler();
});
