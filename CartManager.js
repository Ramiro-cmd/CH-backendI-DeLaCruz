import { promises as fs } from 'fs';


export class CartManager{

    static file = "carts.json" 


    static async leerArchivo() {
        try{
            const data = await fs.readFile(this.file, "utf-8")
            return JSON.parse(data)
        }catch{
            console.log("Error al obtener los datos")
        }
    }
    static async agregarCarrito({products}){
        try{
            const carritos = await this.leerArchivo()

            const idAuto = carritos.length > 0? carritos[carritos.length -1].id +1:1

            const nuevoCarrito = {
                id: idAuto,
                products
            }
            
            carritos.push(nuevoCarrito)

            await fs.writeFile(this.file, JSON.stringify(carritos, null,2))
            return nuevoCarrito
        }catch{
            console.log("Error al agregar el producto")
        }
    }

    static async mostrarCarrito(id){
        const carritos = await this.leerArchivo()
        try{

            const carrito = carritos.find(c=> c.id === id)
            return carrito.products
        }catch{
            console.log("Error al encontrar el id")
            return null
        }
    }

    static async agregarProductCart(cartId, prodId, quantity) {
        try {

            const carritos = await this.leerArchivo()

            const carritoIndex = carritos.findIndex(c => c.id === cartId)
    

            const carrito = carritos[carritoIndex]
            const producto = carrito.products.find(p => p.product === prodId)

            if (producto) {
                producto.quantity += quantity;
            }else{
                carrito.products.push({
                    product: prodId,
                    quantity
                })
            }

            await fs.writeFile(this.file, JSON.stringify(carritos, null, 2))
            return carrito
        }catch (error) {
            console.log("Error al agregar el producto al carrito:", error.message)
        }
    }

    

}