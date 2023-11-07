const socketClient = io();

const createForm = document.getElementById("createForm");
const deleteForm = document.getElementById("deleteForm");
const products = document.getElementById("products");

createForm.onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById("createTitle").value;
    const description = document.getElementById("createDescription").value;
    const price = document.getElementById("createPrice").value;
    const code = document.getElementById("createCode").value;
    const stock = document.getElementById("createStock").value;

    const product = { title, description, price, code, stock };
    socketClient.emit("newProduct", product);

    document.getElementById("createTitle").value = "";
    document.getElementById("createDescription").value = "";
    document.getElementById("createPrice").value = "";
    document.getElementById("createCode").value = "";
    document.getElementById("createStock").value = "";
};

deleteForm.onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById("deleteId").value;
    socketClient.emit("deleteProduct", id);
    
    document.getElementById("deleteId").value = "";
};

socketClient.on("arrayProducts", (productsArray) => {
    let infoProducts = "";
    productsArray.forEach(p => {
        infoProducts += `${p.id} - ${p.title} - ${p.description} - ${p.price} - ${p.code} - ${p.stock}</br>`;
    });
    products.innerHTML = infoProducts;
});
