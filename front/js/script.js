createAllProductsElements();


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
    })
    .catch(() => {
        alert("Impossible de contacter le serveur, les produits ne pourront pas être affichés.")
    });
}


/**
 * Creates the product's DOM element
 * 
 * @param { Object } product
 */

function createProductElement(product) {
    const productsList = document.querySelector(".items");
    const productLink = document.createElement("a");
    productLink.setAttribute("href", `./product.html?id=${product._id}&name=${product.name}`);
    productLink.innerHTML = `
        <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>
    `;
    productsList.append(productLink);

    

    
}