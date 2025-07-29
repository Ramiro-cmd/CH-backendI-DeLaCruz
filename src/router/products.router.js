import { Router } from "express";
import { ProductManager } from "../../ProductManager.js"

let productos = []

const router = Router()

router.get("/", async (req,res)=>{
    productos = await ProductManager.leerArchivo()

    res.status(200).json(productos)
})

router.get("/:id",async (req,res)=>{
    const id = parseInt(req.params.id)
    productos = await ProductManager.leerArchivo()

    const product = productos.find(p => p.id === id)

    if(!product){
        res.status(404).send("Error producto no encontrado")
    }else{
        res.json(product)
    }
})

router.post("/", async (req, res) => {
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

router.put("/:id", async (req, res)=>{
    
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

router.delete("/:id", async (req,res)=>{
    
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

export default router