import { Request, Response } from "express";
import prisma from "../prisma/client";
import { TipoDireccion } from "@prisma/client";

class addressController {
    async getAllAddressesByClient(req: Request, res: Response){
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Missing client ID." });
            }

            const address = await prisma.domicilio.findMany({
                where: {
                    clienteId: id
                }
            });

            return res.json(address);
        }
        catch(e) {
            console.log("There was an error listing the addresses", e);
            return res.status(500).json({ error: "Error when listing the addresses" });
        }
    };

    async getAddressById(req: Request, res: Response){
        try {
            const { id, addressId } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Missing client ID." });
            }

            if(!addressId) {
                return res.status(400).json({ error: "Missing Address ID." });
            }

            const address = await prisma.domicilio.findUnique({
                where: {
                    id: addressId,
                    clienteId: id
                }
            });

            return res.json(address);
        }
        catch(e) {
            console.log("There was an error listing the address", e);
            return res.status(500).json({ error: "Error when listing the address" });
        }
    };

    async createAddress(req: Request, res: Response){
        try {
            const { id } = req.params;
            const { 
                domicilio,
                colonia,
                municipio,
                estado,
                tipo
            } = req.body;

            if (!id) {
                return res.status(400).json({ error: "Missing client ID." });
            }

            if (!domicilio || !colonia || !municipio || !estado || !tipo) {
                return res.status(400).json({ error: "Missing fields." });
            };

            if (!Object.values(TipoDireccion).includes(tipo)) {
                return res.status(400).json({ error: "Invalid Razon Social." });
            }

            const newAddress = await prisma.domicilio.create({
                data: {
                    domicilio,
                    colonia,
                    municipio,
                    estado,
                    tipo,
                    cliente: {
                        connect: { id }
                    }
                }
            });

            return res.json(newAddress);
        }
        catch(e) {
            console.log("There was an error creating the address", e);
            return res.status(500).json({ error: "Error when creating the address" });
        }
    };

    async updateAddress(req: Request, res: Response){
        try {
            const { id, addressId } = req.params;
            const { 
                domicilio,
                colonia,
                municipio,
                estado,
                tipo
            } = req.body;

            if (!id) {
                return res.status(400).json({ error: "Missing client ID." });
            }

            if(!addressId) {
                return res.status(400).json({ error: "Missing Address ID." });
            }

            const data: Record<string, string> = {};

            if (domicilio) {
                data.domicilio = domicilio;
            }
            if (colonia) {
                data.colonia = colonia;
            }
            if (municipio) {
                data.municipio = municipio;
            }
            if (estado) {
                data.estado = estado;
            }
            if (tipo) {
                if (!Object.values(TipoDireccion).includes(tipo)) {
                    return res.status(400).json({ error: "Invalid Tipo." });
                }
                data.telefono = tipo;
            };

            if(Object.keys(data).length === 0){
                return res.status(400).json({ error: "No valid fields provided for update." });
            }

            const updatedAddress = await prisma.domicilio.update({
                where: {
                    id: addressId,
                    clienteId: id
                },
                data
            })
            
            return res.json(updatedAddress);
        }
        catch(e) {
            console.error("Error:", e);
            return res.status(500).json({ error: "There was an error updating the address." });
        };
    };

    async deleteAddress(req: Request, res: Response){
        try {
            const { id, addressId } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Missing client ID." });
            }

            if(!addressId) {
                return res.status(400).json({ error: "Missing Address ID." });
            }

            await prisma.domicilio.delete({
                where: {
                    id: addressId,
                    clienteId: id
                }
            });

            return res.json("Address deleated sucessfully")
        }
        catch(e) {
            console.log('error:', e);
            return res.status(500).json({ error: 'There was an error the client' });
        };
    };
}

export default new addressController();