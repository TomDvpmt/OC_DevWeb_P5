const productId = getProductId();

displayProductPage();


/**
 * Displays the full product's page
 */

async function displayProductPage() {
    const product = await getProduct(productId);
    setProductPageImg(product);
    setProductPageInfos(product);
    setProductPageColorOptions(product);
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
    const localLanguage = document.querySelector("html").lang;
    for(let color of colors) {
        const colorElement = document.createElement("option");
        colorElement.setAttribute("value", color);
        colorElement.innerText = translateColor(color, "eng", "fr");
        colorsElement.append(colorElement);
    }
}


/**
 * Gets a single product from the API
 * 
 * @param { Integer } productId
 * @return { Promise } 
 */

async function getProduct(productId) {
    const data = await fetch(`http://localhost:3000/api/products/${productId}`);
    const product = data.json();
    return product;
}


/**
 * Gets the product's id from URL's search parameters
 * 
 * @return { Number }
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
 * @return { URLSearchParams }
 */

function getSearchParams() {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    return searchParams;
}




/**
 * Gets a color name in user's local language from its name in english
 * 
 * @param { String } engColorString - Name of the color in english
 * @return { String }
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