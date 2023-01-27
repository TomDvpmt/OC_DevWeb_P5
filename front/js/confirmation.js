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


const orderIdElement = document.querySelector("#orderId");
const searchParams = getSearchParams();

if(searchParams.has("orderId")) {
    const orderId = searchParams.get("orderId");
    orderIdElement.innerText = orderId;
}

