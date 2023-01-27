
/**
 * Displays the full product's page
 */

const displayProductPage = async () => {
    const productId = getProductId();
    const product = await getProductFromAPI(productId);
    setProductPageImg(product);
    setProductPageInfos(product);
    setProductPageColorOptions(product);
    setAddToCartListener();
}


/**
 * Gets the product's id from URL's search parameters
 * 
 * @returns { String }
 */

const getProductId = () => {
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

const getSearchParams = () => {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    return searchParams;
}



/**
 * Gets a single product from the API
 * 
 * @param { String } productId
 * @returns { Promise } 
 */

const getProductFromAPI = async (productId) => {
    try {
        const data = await fetch(`http://localhost:3000/api/products/${productId}`);
        const product = data.json();
        return product;
    } 
    catch(e) {
        alert("Impossible de contacter le serveur, le produit ne pourra pas être affiché.");
    }
}


/**
 * Sets the product's image on the product's page
 * 
 * @param { Object } product
 */

const setProductPageImg = (product) => {
    const imgParent = document.querySelector(".item__img");
    const imgElement = document.createElement("img");
    imgElement.src = product.imageUrl;
    imgElement.setAttribute("alt", product.altTxt);
    imgParent.append(imgElement);
}


 /**
  * Sets the product's infos (name, price, description) on the product's page
  * 
  * @param { Object } product 
  * @const { Array } infoCouples
  */

const setProductPageInfos = (product) => {
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

const setProductPageColorOptions = (product) => {
    const localLanguage = document.querySelector("html").lang;
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

const translateColor = (color, langInitial, langFinal) => {
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
 * Sets a "click" event listener on the "Add to cart" button
 * On click :
 *   - if quantity and color are both set, adds the item to the cart and send user to cart.html
 *   - else does nothing
 */

const setAddToCartListener = () => {
    const addToCartButton = document.querySelector("#addToCart");

    addToCartButton.addEventListener("click", () => {
        const productToAdd = getProductToAdd();
        if(productParamsAreSet(productToAdd)) {
            addToCart(productToAdd);
            window.location.href = "cart.html";
        }
    });
}

/**
 * Gets the product's id, color and quantity
 * 
 * @returns { Object }
 */

const getProductToAdd = () => {
    const productId = getProductId();
    const productColor = document.querySelector("#colors").value;
    const productQuantity = document.querySelector("#quantity").value;
    const productToAdd = {
        id: productId, 
        color: productColor, 
        quantity: productQuantity
    };
    return productToAdd;
}


/**
 * Checks if product's color and quantity are set
 * 
 * @param { Object } productToAdd 
 * @returns { Boolean } 
 */

const productParamsAreSet = (productToAdd) => {
    return productToAdd.color !== "" && productToAdd.quantity !== "0";
}


/**
 * Adds the product to the cart, or updates quantity if product already exists
 * 
 * @param { Object } productToAdd 
 */

const addToCart = (productToAdd) => {
    if(localStorage.length === 0) {
        addToLocalStorage(productToAdd);
    }
    else {
        for(key in localStorage) {
            if(!localStorage.hasOwnProperty(key)) { // skips methods (getItem(), setItem(), clear()...)
                continue;
            }

            const storedProduct = JSON.parse(localStorage.getItem(key));
            if(isSameProduct(productToAdd, storedProduct)) {
                updateProductQuantity(productToAdd, storedProduct, key);
                break;
            }
            if(isLastStorageKey(key) && !isSameProduct(productToAdd, storedProduct)) {
                addToLocalStorage(productToAdd);
            }
        }
    }
}

/**
 * In localStorage iteration (for... in loop), checks if the current iteration is the last of the loop
 * 
 * @param { Integer } key 
 * @returns { Boolean }
 */

const isLastStorageKey = (key) => {
    return key === localStorage.key(localStorage.length - 1)
}


/**
 * Updates quantity of the product to add :
 * 
 * @param { Object } productToAdd
 * @param { Object } storedProduct
 * @param { Integer } key
 */

const updateProductQuantity = (productToAdd, storedProduct, key) => {
    storedProduct.quantity = parseInt(storedProduct.quantity) + parseInt(productToAdd.quantity);
    const stringifiedProduct = JSON.stringify(storedProduct);
    localStorage.setItem(key, stringifiedProduct);
}


/**
 * Checks if the product to add already exists in localStorage (has same id and same color)
 * 
 * @param { Object } productToAdd 
 * @param { Object } storedProduct 
 * @returns { Boolean }
 */

const isSameProduct = (productToAdd, storedProduct) => {
    return productToAdd.id === storedProduct.id && productToAdd.color === storedProduct.color;
}


/**
 * Adds a product to localStorage
 * 
 * @param { Object } productToAdd 
 */

const addToLocalStorage = (productToAdd) => {
    const newKey = getProductStorageKey(productToAdd);
    const stringifiedItem = JSON.stringify(productToAdd);
    localStorage.setItem(newKey, stringifiedItem);
}


/**
 * Gets the product's key in localStorage
 * 
 * @param { Object } product 
 * @returns { String }
 */

const getProductStorageKey = (product) => {
    return `${product.id}-${product.color}`;
}


displayProductPage();