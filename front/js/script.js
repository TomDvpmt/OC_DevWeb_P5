displayAllProducts();


/**
 * Displays all products on the page
 */

function displayAllProducts() {
    fetchProducts()
    .then(response => response.json())
    .then(allProducts => {
        for(product of allProducts) {
            displayProduct(product);
        }
    })
    .catch(() => {
        alert("Impossible de contacter le serveur, les produits ne pourront pas être affichés.")
    });
}


/**
 * Gets all products from the API
 * @returns { Promise }
 */

function fetchProducts() {
    return fetch("http://localhost:3000/api/products")
}



/**
 * Displays 1 product on the page
 * 
 * @param { Object } product
 */

function displayProduct(product) {
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