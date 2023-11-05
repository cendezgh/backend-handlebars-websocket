import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const productsJSON = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(productsJSON);
      } else return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async #getMaxId() {
    let maxId = 0;
    const products = await this.getProducts();
    products.forEach((product) => {
      if (product.id > maxId) maxId = product.id;
    });
    return maxId;
  }

  async createProduct(productObj) {
    try {
      const productId = (await this.#getMaxId()) + 1;
      const product = { id: productId, ...productObj };
  
      if (!product.hasOwnProperty('status')) {
        product.status = true;
      }
  
      const products = await this.getProducts();
      products.push(product);
  
      await fs.promises.writeFile(this.path, JSON.stringify(products));
  
      return product;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id === id);

      return product || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateProduct(id, updatesObj) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return false;

      products[index] = { ...products[index], ...updatesObj };

      await fs.promises.writeFile(this.path, JSON.stringify(products));

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const updatedProductsArr = products.filter((p) => p.id !== id);
      await fs.promises.writeFile(this.path, JSON.stringify(updatedProductsArr));

      this.io.emit('productDeleted', id);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}