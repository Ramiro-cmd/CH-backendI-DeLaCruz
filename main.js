import express from "express"
import fs from "fs/promises"
import { ProductManager } from "./ProductManager.js"
import { CartManager } from "./CartManager.js"
const app = express()
let productos = []
let carritos = []


app.use(express.json());
app.get("/api/products", async (req,res)=>{
    productos = await ProductManager.leerArchivo()

    res.status(200).json(productos)
})

app.get("/api/products/:id",async (req,res)=>{
    const id = parseInt(req.params.id)
    productos = await ProductManager.leerArchivo()

    const product = productos.find(p => p.id === id)

    if(!product){
        res.status(404).send("Error producto no encontrado")
    }else{
        res.json(product)
    }
})

app.post("/api/products", async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body

    if (!title || !description || !code || price == null || stock == null || !category) {
      return res.status(400).send("Falta agregar datos")
    }

    const nuevoProducto = await ProductManager.agregarProducto({
      title,
      description,
      code,
      price,
      status: status ?? true,
      stock,
      category,
      thumbnails: thumbnails ?? []
    })

    res.status(201).json(nuevoProducto)
  } catch (error) {
    res.status(500).send("Error al agregar el producto")
  }
})

app.put("/api/products/:id", async (req, res)=>{
    
    try{
        const id = parseInt(req.params.id)
        const modificar = req.body
        productos = await ProductManager.leerArchivo()

        const product = productos.findIndex(p => p.id === id)

        if(!product){
            res.status(404).send("Error producto no encontrado")
        }else{
            const idOri = productos[product].id
            productos[product] = {
                ...productos[product],
                ...modificar,
                id: idOri
            }
            await fs.writeFile(ProductManager.file, JSON.stringify(productos, null, 2)) 
            res.json(productos[product])       
        }

    }catch{
        console.log("Error al modificar el producto")
    }
    

})

app.delete("/api/products/:id", async (req,res)=>{
    
    const id = parseInt(req.params.id)
    try{
        const lista = await ProductManager.eliminarProducto(id)
        if(lista === null){
            res.status(404).send("Error producto no encontrado")
        }else{
            
            res.send("Producto eliminado")
        }

    }catch{
        res.status(500).send
    }
})




app.post("/api/carts", async (req, res) => {
    try {
        const { products } = req.body

        const nuevoCarrito = await CartManager.agregarCarrito({
        products: products ?? [] 
        })

        res.status(201).json(nuevoCarrito)
    }catch (error) {
        res.status(500).send("Error al agregar el producto")
    }
})

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid)
    const prodId = parseInt(req.params.pid)
    const { quantity } = req.body

    if (!quantity || quantity <= 0) {
        return res.status(400).send("Cantidad inválida")
    }

    try {
        const carritoActualizado = await CartManager.agregarProductCart(cartId, prodId, quantity)
        res.status(200).json(carritoActualizado)
    }catch{
    res.status(500).send("Error al agregar producto al carrito")
  }
})



app.get("/api/carts", async (req,res)=>{
    carritos = await CartManager.leerArchivo()

    res.status(200).json(carritos)
})

app.get("/api/carts/:id", async (req,res)=>{

    const id = parseInt(req.params.id)
    try{
        const carrito = await CartManager.mostrarCarrito(id)
        res.json(carrito)
        console.log(typeof carrito)
    }catch{
        res.status(404).send("Error id no encontrado")
    }
})





app.listen(8080, ()=>{
    console.log("Servidor iniciado")
})