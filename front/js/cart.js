const localLanguage = document.querySelector("html").lang;
const allQuantities = [];
const allPrices = [];

displayCart();


/**
 * Displays the cart
 */

async function displayCart() {
    await displayAllCartItems();
    displayCartTotalQuantity(allQuantities);
    displayCartTotalPrice(allPrices)
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
    cartItem.setAttribute("data-id", product.id);
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
    allQuantities.push(storageItem.quantity);
    const totalItemPrice = parseInt(product.price) * parseInt(storageItem.quantity);
    allPrices.push(totalItemPrice);
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
 * Sets total quantity in cart (adds all quantities)
 * 
 * @param { Array } allQuantities
 */

function displayCartTotalQuantity(allQuantities) {
    const cartTotalQuantityElement = document.querySelector("#totalQuantity");
    
    let totalQuantity = allQuantities.reduce(
        (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue),
        0
    )
    cartTotalQuantityElement.innerText = totalQuantity;
}


/**
 * Sets total cart price (adds all prices)
 * 
 * @param { Array } allPrices
 */

function displayCartTotalPrice(allPrices) {
    const cartTotalPriceElement = document.querySelector("#totalPrice");

    let totalPrice = allPrices.reduce(
        (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue),
        0
    )
    cartTotalPriceElement.innerText = totalPrice;
}



/**
 * Translates a color's common name from a language to another
 * 
 * @param { String } color - Common name of the color in the initial language (ex : "yellow")
 * @param { String } langInitial - Code of the language to translate from (ex : "eng", "fr"...)
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