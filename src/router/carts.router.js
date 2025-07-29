import { Router } from "express";
import { CartManager } from "../../CartManager.js"

let carritos = []

const router = Router()

router.post("/", async (req, res) => {
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

router.post("/:cid/product/:pid", async (req, res) => {
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



router.get("/", async (req,res)=>{
    carritos = await CartManager.leerArchivo()

    res.status(200).json(carritos)
})

router.get("/:id", async (req,res)=>{

    const id = parseInt(req.params.id)
    try{
        const carrito = await CartManager.mostrarCarrito(id)
        res.json(carrito)
        console.log(typeof carrito)
    }catch{
        res.status(404).send("Error id no encontrado")
    }
})

export default router