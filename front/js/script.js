/**
 * Get all products from the API
 */

function createAllProductsElements() {
    fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(allProducts => {
        for(product of allProducts) {
            createProductElement(product);
        }
    });
}

createAllProductsElements();


/**
 * Creates the product's DOM element
 * 
 * @param { Object } product
 */

function createProductElement(product) {
    const productsList = document.querySelector(".items");
    
    const productLink = document.createElement("a");
    productLink.setAttribute("href", `./product.html?id=${product._id}&name=${product.name}`);

    const productArticle = document.createElement("article");
    
    const productImg = document.createElement("img");
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;

    const productName = document.createElement("h3");
    productName.classList.add("productName");
    productName.textContent = product.name;

    const productDescription = document.createElement("p");
    productDescription.classList.add("productDescription");
    productDescription.textContent = product.description;

    productArticle.append(productImg);
    productArticle.append(productName);
    productArticle.append(productDescription);
    productLink.append(productArticle);
    productsList.append(productLink);
}