import { promises as fs } from 'fs';


export class ProductManager{

    static file = "products.json"


    static async leerArchivo() {
        try{
            const data = await fs.readFile(this.file, "utf-8")
            return JSON.parse(data)
        }catch{
            console.log("Error al obtener los datos")
        }
    }


    static async agregarProducto(producto){
        try{
            const productos = await this.leerArchivo()

            const idAuto = productos.length > 0? productos[productos.length -1].id +1:1

            const nuevoProducto = {
                id: idAuto,
                ...producto
            }
            
            productos.push(nuevoProducto)

            await fs.writeFile(this.file, JSON.stringify(productos, null,2))
            return nuevoProducto
        }catch{
            console.log("Error al agregar el producto")
        }
    }

    static async eliminarProducto(id){
        try{
            const productos = await this.leerArchivo()

            const listaProductos = productos.filter(p => p.id !== id)
            
            if(productos.length === listaProductos.length){
                console.log("No se encontro el producto")
                return null
            }else{
                await fs.writeFile(this.file, JSON.stringify(listaProductos, null, 2))
            }

        }catch{
            console.log("Error al eliminar el producto")
        }
    }


}