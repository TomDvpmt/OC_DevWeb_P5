const localLanguage = document.querySelector("html").lang;

displayCart();


/**
 * Displays the cart
 */

async function displayCart() {
    await displayAllCartItems();
    displayCartTotalQuantity();
    displayCartTotalPrice();
    setQuantityEventListener();
}


/**
 * Displays all cart items
 */

async function displayAllCartItems() {

    const storageItems = [];
    for(i = 0 ; i < localStorage.length ; i++) {
        const storageItem = JSON.parse(localStorage.getItem(i));
        storageItems.push(storageItem);
    }
    
    for(let storageItem of storageItems) {
        await displayCartItem(storageItem);
    }
}


/**
 * Displays an item in the cart from an item in localStorage
 * 
 * @param { Object } storageItem
 */

async function displayCartItem(storageItem) {

    const cart = document.querySelector("#cart__items");
    
    const product = await getProduct(storageItem.id);
    
    const cartItem = document.createElement("article");
    cartItem.classList.add("cart__item");
    cartItem.setAttribute("data-id", storageItem.id);
    cartItem.setAttribute("data-color", storageItem.color);
    cartItem.innerHTML = `
        <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${translateColor(storageItem.color, "eng", localLanguage)}</p>
            <p>${product.price} €</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${storageItem.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
            </div>
        </div>
        </div>
    `;
    cart.append(cartItem);
}

/**
 * Gets a single product from the API
 * 
 * @param { Integer } productId
 * @returns { Promise } 
 */

async function getProduct(productId) {
    const data = await fetch(`http://localhost:3000/api/products/${productId}`);
    const product = data.json();
    return product;
}


/**
 * Sets total quantity in cart
 */

function displayCartTotalQuantity() {
    const cartTotalQuantityElement = document.querySelector("#totalQuantity");
    const allQuantities = [];
    const allQuantityElements = document.querySelectorAll(".itemQuantity");
    
    for(let quantityElement of allQuantityElements) {
        allQuantities.push(quantityElement.value);
    }

    let totalQuantity = arraySum(allQuantities);
    cartTotalQuantityElement.innerText = totalQuantity;
}


/**
 * Sets total cart price
 * 
 */

function displayCartTotalPrice() {
    const cartTotalPriceElement = document.querySelector("#totalPrice");
    const allPrices = [];
    const allPriceElements = document.querySelectorAll(".cart__item__content__description p:last-child");

    for(let priceElement of allPriceElements) {
        const parentElement = priceElement.closest("article");
        const quantityElement = parentElement.querySelector("input");
        const itemTotalPrice = parseInt(priceElement.innerText) * parseInt(quantityElement.value);
        allPrices.push(itemTotalPrice);
    }

    let totalPrice = arraySum(allPrices);
    cartTotalPriceElement.innerText = totalPrice;
}

/**
 * Gets the sum of an array's values
 * 
 * @param { Array } array
 * @returns { Number }
 */

function arraySum(array) {
    const total = array.reduce(
        (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue),
        0
    )
    return total;
}


/**
 * Sets a "change" eventListener on each item quantity in the cart.
 * On change, updates the total quantity and the item's quantity in localStorage.
 */

function setQuantityEventListener() {
    const itemQuantityElements = document.querySelectorAll(".itemQuantity");
    for(let itemQuantityElement of itemQuantityElements) {
        itemQuantityElement.addEventListener("change", (e) => {
            displayCartTotalQuantity();
            displayCartTotalPrice();
            
            const itemNewQuantity = parseInt(e.target.value);
            updateItemQuantityInLocalStorage(itemQuantityElement, itemNewQuantity);
        })
    }
};


/**
 * Updates an item's quantity in localStorage
 * 
 * @param { HTMLElement } element 
 * @param { Integer } newQuantity 
 */

function updateItemQuantityInLocalStorage(element, newQuantity) {
    const item = getIdAndColorOfElement(element);
    const updatedProduct = {
        id: item.id,
        color: item.color,
        quantity: newQuantity
    }
    for(i = 0 ; i < localStorage.length; i++) {
        const storedItem = JSON.parse(localStorage.getItem(i));
        if(updatedProduct.id === storedItem.id && updatedProduct.color === storedItem.color) {
            storedItem.quantity = parseInt(updatedProduct.quantity);
            const stringifiedItem = JSON.stringify(storedItem);
            localStorage.setItem(i, stringifiedItem);
            break;
        }
    }
}

/**
 * Gets the ID and color of an element's article parent
 * 
 * @param { HTMLElement } element 
 * @returns { Object }
 */


function getIdAndColorOfElement(element) {
    const parentElement = element.closest("article");
    const itemId = parentElement.getAttribute("data-id");
    const itemColor = parentElement.getAttribute("data-color");
    return {itemId, itemColor}
}



/**
 * Translates a color's common name from a language to another
 * 
 * @param { String } color - Common name of the color in the initial language (ex : "yellow")
 * @param { String } langInitial - Code of the language to translate from (ex : "eng")
 * @param { String } langFinal - Code of the language to translate to
 * @returns { String }
 */

function translateColor(color, langInitial, langFinal) {
    const localColors = {
        eng: {
            black: "Black",
            blackRed: "Black/Red",
            blackYellow: "Black/Yellow",
            blue: "Blue",
            brown: "Brown",
            green: "Green",
            grey: "Grey",
            navy: "Navy",
            orange: "Orange",
            pink: "Pink",
            purple: "Purple",
            red: "Red",
            silver: "Silver",
            white: "White",
            yellow: "Yellow"
        },
        fr: {
            black: "Noir",
            blackRed: "Noir/Rouge",
            blackYellow: "Noir/Jaune",
            blue: "Bleu",
            brown: "Marron",
            green: "Vert",
            grey: "Gris",
            navy: "Bleu marine",
            orange: "Orange",
            pink: "Rose",
            purple: "Violet",
            red: "Rouge",
            silver: "Argenté",
            white: "Blanc",
            yellow: "Jaune"
        }
    }

    for(colorProperty in localColors[langInitial]) {
        if(localColors[langInitial][colorProperty] === color) {
            const translatedColor = localColors[langFinal][colorProperty];
            return translatedColor ? translatedColor : color;
        }
    }
}