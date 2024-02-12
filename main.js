const fs = require('fs');

class ProductManager {

    constructor(filePath) {
        if (!filePath || filePath.trim() === '') {
            // If filePath is empty or whitespace, use a default file path
            this.filePath = "./products.json"
            console.log(`No file path provided. Using default file path: ${this.filePath}`);
        } else {
            this.filePath = filePath;
        }

        // Check if the file exists, if not create a new one
        if (!fs.existsSync(this.filePath)) {
            try {
                fs.writeFileSync(this.filePath, '[]', 'utf8');
                console.log(`New file created at ${filePath}`);
            } catch (error) {
                console.error("Error creating new file:", error);
            }
        }
    }

    readProductsFromDB() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading data:", error);
            return [];
        }
    }

    // Method to write data to the persistence file
    writeProductsToDB(data) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            console.error("error al escribir la data:", error);
        }
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // validaciones
        if (title === "" || description === "" || price === "" || thumbnail === "" || code === "" || stock === "") {
            console.log(`All fields are required`)
            return
        }

        let products = this.readProductsFromDB()

        let codeExist = products.find(prod => prod.code === code)
        if (codeExist) {
            console.log(`This code ${code} is duplicated!!!`)
            return
        }

        let id = 1
        if (products.length > 0) {
            id = this.products[this.products.length - 1].id + 1
        }

        let newProduct = { id, title, description, price, thumbnail, code, stock }
        products.push(newProduct)

        this.writeProductsToDB(products)
    }


    getProducts() {
        // traemos los products del archivo
        return this.readProductsFromDB()
    }

    getProductById(id) {
        let products = this.readProductsFromDB()

        let product = products.find(prod => prod.id === id)
        if (!product) {
            console.log(`Not Found`)
            return
        }

        return product
    }

    updateProduct(id, updatedProduct) {
        let products = this.readProductsFromDB();
        const index = products.findIndex(prod => prod.id === id);
        if (index === -1) {
            console.log(`Product with ID ${id} not found`);
            return;
        }

        // Old product
        let product = products[index]

        // Update product information
        if (updatedProduct.title !== undefined) {
            product.title = updatedProduct.title;
        }

        if (updatedProduct.description !== undefined) {
            product.description = updatedProduct.description;
        }

        if (updatedProduct.price !== undefined) {
            product.price = updatedProduct.price;
        }

        if (updatedProduct.thumbnail !== undefined) {
            product.thumbnail = updatedProduct.thumbnail;
        }

        if (updatedProduct.code !== undefined) {
            product.code = updatedProduct.code;
        }

        if (updatedProduct.stock !== undefined) {
            product.stock = updatedProduct.stock;
        }

        this.writeProductsToDB(products);
        console.log(`Product with ID ${id} has been updated`);
    }

    deleteProductById(id) {
        let products = this.readProductsFromDB();
        const index = products.findIndex(prod => prod.id === id);
        if (index === -1) {
            console.log(`Product with ID ${id} not found`);
            return;
        }

        products.splice(index, 1);
        this.writeProductsToDB(products);
        console.log(`Product with ID ${id} has been deleted`);
    }
}


// Testing

// Se creará una instancia de la clase “ProductManager”
let manager = new ProductManager();
console.log(manager.getProducts());
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
console.log(manager.getProducts());
manager.updateProduct(1, {"description":"Esta es una descripcion nueva"})
manager.deleteProductById(1);




