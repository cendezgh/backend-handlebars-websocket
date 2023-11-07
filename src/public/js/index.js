const socketClient = io();

const form = document.getElementById("form");
const inputTitle = document.getElementById("title");
const inputPrice = document.getElementById("price");
const products = document.getElementById("products");

form.onsubmit = (e) => {
    e.preventDefault();
    const title = inputTitle.value;
    const price = inputPrice.value;
    const product = {title , price};
    socketClient.emit("newProduct", product);
    inputTitle.value = "";
    inputPrice.value = "";
};

socketClient.on("arrayProducts", (productsArray) => {
    let infoProducts = "";
    productsArray.forEach(p => {
        infoProducts += `${p.title} - $${p.price} </br>`;
    });
    products.innerHTML = infoProducts
})
