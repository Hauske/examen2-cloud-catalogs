import { Request, Response } from "express";
import prisma from "../prisma/client";
import { UnidadMedia } from "@prisma/client";

class productController {
    async getProducts(req: Request, res: Response){
        try {
            const products = await prisma.producto.findMany({});
            return res.json(products);
        }
        catch(e) {
            console.log("There was an error listing the products", e)
            return res.status(500).json({ error: "Failed to list all products" });
        }
    };

    async getProductById(req: Request, res: Response){
        try {
            const { id } = req.params

            if(!id){
                return res.status(404).json({ error: 'Missing Id' })
            }

            const product = await prisma.producto.findUnique({
                where: { id }
            })

            return res.json(product);
        }
        catch(e) {
            console.log("There was an error listing the product", e)
            return res.status(500).json({ error: "Failed to list the product" });
        }
    };

    async createProduct(req: Request, res: Response){
        try {
            const {
                nombre,
                unidadMedida,
                precioBase,
            } = req.body

            if (!nombre || !unidadMedida || !precioBase) {
                return res.status(400).json({ error: "Missing fields." });
            };

            if (!Object.values(UnidadMedia).includes(unidadMedida)) {
                return res.status(400).json({ error: "Invalid Unidad de Medida." });
            }

            const product = await prisma.producto.create({
                data: {
                    nombre,
                    unidadMedida,
                    precioBase
                }
            });

            return res.json(product);
        }
        catch(e) {
            console.log("There was an error creating the product", e);
            return res.status(500).json({ error: "Failed to creathe the product" });
        }
    };

    async updateProduct(req: Request, res: Response){
        try {
            const { id } = req.params
            const {
                nombre,
                unidadMedida,
                precioBase,
            } = req.body

            if(!id){
                return res.status(404).json({ error: 'Missing Id' })
            }

            const data: Record<string, string> = {};

            if (unidadMedida) {
                if (!Object.values(UnidadMedia).includes(unidadMedida)) {
                    return res.status(400).json({ error: "Invalid Unidad Medida." });
                }
                data.unidadMedida = unidadMedida;
            }

            if(nombre){
                data.nombre = nombre;
            }

            if(precioBase){
                data.precioBase = precioBase
            }

            if (Object.keys(data).length === 0) {
                return res.status(400).json({ error: "No valid fields provided for update." });
            }

            const product = await prisma.producto.update({
                where: { id },
                data
            })

            return res.json(product);
        }
        catch(e) {
            console.log("There was an error updating the product", e)
            return res.status(500).json({ error: "Failed to update the product" });
        }
    };

    async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if(!id){
                return res.status(404).json({ error: 'Missing Id' })
            }

            await prisma.producto.delete({
                where: { id }
            });

            return res.json("Product deleted sucessfully");
        } 
        catch (e) {
            return res.status(500).json({ error: "Failed to delete product" });
        }
    };
}

export default new productController();