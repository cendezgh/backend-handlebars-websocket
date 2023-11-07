const socketClient = io();

const form = document.getElementById("form");
const inputTitle = document.getElementById("title");
const inputPrice = document.getElementById("price");
const inputDescription = document.getElementById("description");
const inputCode = document.getElementById("code");
const inputStock = document.getElementById("stock");
const inputThumbnail = document.getElementById("thumbnail");

form.onsubmit = (e) => {
    e.preventDefault();
    const title = inputTitle.value;
    const price = inputPrice.value;
    const description = inputDescription.value;
    const code = inputCode.value;
    const stock = inputStock.value;
    const thumbnail = inputThumbnail.value;
    const product = { title, price, description, code, stock, thumbnail };
    socketClient.emit("newProduct", product);
    form.reset();
};

socketClient.on("arrayProducts", (productsArray) => {
    let infoProducts = "";
    productsArray.forEach(p => {
        infoProducts += `${p.title} - $${p.price} </br>`;
    });
    document.getElementById("products").innerHTML = infoProducts;
});
