const localLanguage = document.querySelector("html").lang;
const productId = getProductId();

displayProductPage();




/**
 * Gets the product's id from URL's search parameters
 * 
 * @returns { Number }
 */

function getProductId() {
    const searchParams = getSearchParams();
    if(searchParams.has("id")) {
        const productId = searchParams.get("id");
        return productId;
    }
}


/**
 * Gets the search parameters from the URL
 * 
 * @returns { URLSearchParams }
 */

function getSearchParams() {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    return searchParams;
}


/**
 * Displays the full product's page
 */

async function displayProductPage() {
    const product = await getProduct(productId);
    setProductPageImg(product);
    setProductPageInfos(product);
    setProductPageColorOptions(product);
    setAddToCartListener();
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
 * Sets the product's image on the product's page
 * 
 * @param { Object } product
 */

function setProductPageImg(product) {
    const imgParent = document.querySelector(".item__img");
    const imgElement = document.createElement("img");
    imgElement.src = product.imageUrl;
    imgElement.setAttribute("alt", product.altTxt);
    imgParent.append(imgElement);
}

 /**
  * Sets the product's infos on the product's page
  * NB : the image of the product is set with the setproductPageImg function
  * 
  * @param { Object } product 
  * @const { Array } couples - array of arrays : [<DOM selector>, <innerText>]
  */

function setProductPageInfos(product) {
    const infoCouples = [
        ["head > title", product.name],
        ["#title", product.name], 
        ["#price", product.price], 
        ["#description", product.description]
    ];
    for(let infoCouple of infoCouples) {
        const element = document.querySelector(infoCouple[0]);
        element.innerText = infoCouple[1];
    }
}

/**
 * Sets the colors dropdown list on the product's page
 * 
 * @param { Object } product 
 */

function setProductPageColorOptions(product) {
    const colors = product.colors;
    const colorsElement = document.querySelector("#colors");
    
    for(let color of colors) {
        const colorElement = document.createElement("option");
        colorElement.setAttribute("value", color);
        colorElement.innerText = translateColor(color, "eng", localLanguage);
        colorsElement.append(colorElement);
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
 * Sets the event listener on the "Add to cart" button in product.html
 */

function setAddToCartListener() {
    const addToCartButton = document.querySelector("#addToCart");

    addToCartButton.addEventListener("click", () => {
        const productColor = document.querySelector("#colors").value;
        const productQuantity = document.querySelector("#quantity").value;
        const productToAdd = {
            id: productId, 
            color: productColor, 
            quantity: productQuantity
        };

        productColor === "" || productQuantity === "0" ?
            console.log("Merci de choisir une couleur et une quantité pour ce produit.") :
            addToCart(productToAdd);
    });
}


/**
 * Stores the product (id, color, quantity) in localStorage
 * 
 * @param { Object } productToAdd 
 */

function addToCart(productToAdd) {
    let item = productToAdd;
    let itemStorageNumber = localStorage.length;
    
    for(i = 0 ; i < localStorage.length; i++) {
        const storedItem = JSON.parse(localStorage.getItem(i));
        if(productToAdd.id === storedItem.id && productToAdd.color === storedItem.color) {
            item.quantity = parseInt(storedItem.quantity) + parseInt(productToAdd.quantity);
            itemStorageNumber = i;
            break;
        }
    }
    const stringifiedItem = JSON.stringify(item);
    localStorage.setItem(itemStorageNumber, stringifiedItem);
}