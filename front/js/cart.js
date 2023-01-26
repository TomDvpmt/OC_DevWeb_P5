displayCart();
setFormEventListeners();


/**
 * Displays the cart
 */

async function displayCart() {
    await displayAllCartItems();
    setQuantityEventListener();
    setDeleteItemEventListener();
    displayCartTotalQuantity();
    displayCartTotalPrice();
}


/**
 * Displays all cart items
 */

async function displayAllCartItems() {
    for(let key in localStorage) {
        if(!localStorage.hasOwnProperty(key)) { // skips methods (getItem(), setItem(), clear()...)
            continue;
        }
        const parsedItem = JSON.parse(localStorage.getItem(key));
        await displayCartItem(parsedItem);
    }
}


/**
 * Displays an item in the cart from an item in localStorage
 * 
 * @param { Object } parsedItem
 */

async function displayCartItem(parsedItem) {
    const localLanguage = document.querySelector("html").lang;
    const cart = document.querySelector("#cart__items");
    const product = await getProduct(parsedItem.id);
    
    const cartItem = document.createElement("article");
    cartItem.classList.add("cart__item");
    cartItem.setAttribute("data-id", parsedItem.id);
    cartItem.setAttribute("data-color", parsedItem.color);
    cartItem.innerHTML = `
        <div class="cart__item__img">
        <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${translateColor(parsedItem.color, "eng", localLanguage)}</p>
            <p>${product.price} €</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${parsedItem.quantity}">
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
 * @param { String } productId
 * @returns { Promise } 
 */

async function getProduct(productId) {
    try {
        const data = await fetch(`http://localhost:3000/api/products/${productId}`);
        const product = data.json();
        return product;
    }
    catch (error) {
        alert("Impossible de contacter le serveur, les produits du panier ne pourront pas être affichés.");
    }
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


/**
 * Displays cart total quantity
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
 * Displays cart total price
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
 * Sets a "change" event listener on each item quantity in the cart.
 * On change :
 *   - displays new total quantity
 *   - displays new total price
 *   - updates the item's quantity in localStorage.
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
        id: item.itemId,
        color: item.itemColor,
        quantity: newQuantity
    }
    const updatedProductStorageKey = `${updatedProduct.id}-${updatedProduct.color}`;
    for(key in localStorage) {
        if(!localStorage.hasOwnProperty(key)) {
            continue;
        }
        const parsedItem = JSON.parse(localStorage.getItem(key));
        const storedItemStorageKey = `${parsedItem.id}-${parsedItem.color}`;
        if(updatedProductStorageKey === storedItemStorageKey) {
            parsedItem.quantity = parseInt(updatedProduct.quantity);
            const stringifiedItem = JSON.stringify(parsedItem);
            localStorage.setItem(updatedProductStorageKey, stringifiedItem);
        }    
    }
}


/**
 * Sets a "click" event listener on each "delete" button in the cart
 * On click : 
 *   - deletes item in localStorage
 *   - deletes item in DOM
 *   - updates total quantity and total price
 */

function setDeleteItemEventListener() {
    const deleteItems = document.querySelectorAll(".deleteItem");
    for(let deleteItem of deleteItems) {
        deleteItem.addEventListener("click", () => {
            
            deleteItemInLocalStorage(deleteItem);

            const parentArticle = deleteItem.closest("article");
            parentArticle.remove();
            
            displayCartTotalQuantity();
            displayCartTotalPrice();
        })
    }
}

/**
 * Deletes an item in localStorage
 * 
 * @param { HTMLElement } item 
 */

function deleteItemInLocalStorage(item) {
    const itemToDelete = getIdAndColorOfElement(item);
    const itemToDeleteStorageKey = `${itemToDelete.itemId}-${itemToDelete.itemColor}`;
    localStorage.removeItem(itemToDeleteStorageKey);
}



/**
 * Gets the ID and color of an element's article parent
 * 
 * @param { HTMLElement } element 
 * @returns { Object }
 */

function getIdAndColorOfElement(element) {
    const parentElement = element.closest("article");
    const itemId = parentElement.dataset.id;
    const itemColor = parentElement.dataset.color;
    return {itemId, itemColor}
}


/**
 * Sets event listeners on inputs in the form
 */

function setFormEventListeners() {
    const formInputs = ["firstName", "lastName", "address", "city", "email"];
    for(input of formInputs) {
        setFormEventListener(input);
    }
    setSubmitEventListener();
}



/**
 * 
 * Sets an event listener on a text input of the form
 * 
 * @param { String } input
 */

function setFormEventListener(input) {
    const inputElement = document.querySelector(`#${input}`);
    const inputErrorMsgElement = document.querySelector(`#${input}ErrorMsg`);
    inputElement.addEventListener("change", (e) => {
        if(!isValid(input, e.target.value)) {
            displayInputErrorMsg(input, inputErrorMsgElement);
        }
        else{
            inputErrorMsgElement.innerText = "";
        } 
    });
}



/**
 * Tests if string given by user matches a regex
 * 
 * @param { String } inputName
 * @param { String } stringToTest
 * @returns { Boolean }
 * 
 * 
 * ================== REGEX rules  ===========================
 * 
 * First name, last name and city regex :
 * ------------------------------------ 
 *   - first group of characters : 
 *              starts with a letter
 *              then optional letters, apostrophes or dashes
 *   - then optional groups of letters, apostrophes, dashes or white spaces
 *   - ends with a letter or an apostrophe
 *   - case insensitive
 *                         
 *              
 * Address regex :
 * -------------
 *   - starts with an optional group of digits including optional comma and ending with a white space
 *   - then at least 1 group of letters or dash or apostrophe ending with a white space
 *   - ends with 4 or 5 digits (= zip code)
 *   - case insensitive
 * 
 * 
 * Email regex :
 * ------------
 *   - starts with at least 1 alphanumeric character, underscore, dash or dot 
 *   - then @
 *   - then at least 1 group of alphanumeric characters, underscores or dashes, ending with a dot
 *   - ends with 2 to 4 alphanumeric characters
 *   - no accents
 * 
 * ============================================================
 */

function isValid(inputName, stringToTest) {
    const firstNameRegex = new RegExp(
        "(^[a-zà-ÿ][a-zà-ÿ-']?)+([a-zà-ÿ-' ]+)?[a-zà-ÿ']$", "i"
    );
    const addressRegex = new RegExp(
        "^([0-9]+[,]? )?([a-zà-ÿ-']+ )+[0-9]{4,5}$", "i"
    );
    const emailRegex = new RegExp(
        "^[A-Za-z0-9-\._]+@([A-Za-z0-9_-]+\.)+[A-Za-z0-9]{2,4}$"
    );
    const regexs = {
        firstName: firstNameRegex,
        lastName: firstNameRegex,
        address: addressRegex,
        city: firstNameRegex,
        email: emailRegex
    }
    return regexs[inputName].test(stringToTest);
}



/**
 * Displays the error message of an invalid input
 * 
 * @param { String } inputName 
 */

function displayInputErrorMsg(inputName, errorMsgElement) {
    
    const textErrorMessages = {
        firstName: "Prénom invalide. Le prénom doit commencer par une lettre, et ne peut comporter ensuite que des lettres, tirets, apostrophes ou espaces.",
        lastName: "Nom invalide. Le nom doit commencer par une lettre, et ne peut comporter ensuite que des lettres, tirets, apostrophes ou espaces.",
        address: "Adresse invalide. N'oubliez pas le code postal à la fin.",
        city: "Format de ville invalide. Le nom de la ville doit commencer par une lettre, et ne peut comporter ensuite que des lettres, tirets, apostrophes ou espaces.",
        email: "Adresse email invalide."
    }
    errorMsgElement.innerText = textErrorMessages[inputName];
}


/**
 * Sets a submit event listener on the form
 * 
 * @param { SubmitEvent } e
 */

function setSubmitEventListener() {
    const form = document.querySelector(".cart__order__form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        sendOrderRequest();
    })
}


/**
 * Sends a contact object and an array of products' ids to the API in a POST request, then if the promise is resolved, gets the orderId and sends it (and the user) to confirmation.html
 */


function sendOrderRequest(){
    const contact = getFormInputs();
    const products = getLocalStorageItems();
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({contact, products})
    })
    .then((response) => response.json())
    .then((data) => {
        window.location.href = `confirmation.html?orderId=${data.orderId}`;
    })
    .catch(() => alert("Erreur serveur, impossible d'envoyer la commande."))
}


/**
 * Gets all the current values in the form's input fields
 * 
 * @returns { Object }
 */

function getFormInputs() {
    const contact = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value
    }
    return contact;
}


/**
 * Gets all the items' ids in localStorage
 * 
 * @returns { Array }
 */

function getLocalStorageItems() {
    const localStorageItemsIds = [];
    for(key in localStorage) {
        if(!localStorage.hasOwnProperty(key)) {
            continue;
        }
        const product = JSON.parse(localStorage.getItem(key))
        localStorageItemsIds.push(product.id);
    }
    return localStorageItemsIds;
}