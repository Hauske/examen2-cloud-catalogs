import { Request, Response } from "express";
import prisma from "../prisma/client";
import { TipoSociedad } from "@prisma/client";

function validRFC(rfc: string): boolean {
    const regex = /^([A-ZÑ&]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z\d]{2}[A\d]$/i;
    return regex.test(rfc);
}

function validEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validPhone(phone: string): boolean {
    const regex = /^\d{10}$/;
    return regex.test(phone);
}

class clientController {
    async getClients(req: Request, res: Response){
        try {
            const clients = await prisma.cliente.findMany({});
            return res.json({ clients });
        }
        catch(e){
            console.log('error:', e);
            return res.status(500).json({ error: 'There was an error listing clients' });
        }
    };

    async getClientById(req: Request, res: Response){
        try{
            const { id } = req.params

            const client = await prisma.cliente.findUnique({
                where: { id }
            })

            if (!client) {
                return res.status(404).json({ error: "Client not found" });
            }

            return res.json(client);
        }
        catch(e){
            console.log('error:', e);
            return res.status(500).json({ error: 'There was an error the client' });
        }
    };

    async createClient(req: Request, res: Response){
        try {
            const {
                razonSocial,
                nombreComercial,
                rfc,
                correoElectronico,
                telefono,
            } = req.body;

            if (!razonSocial || !nombreComercial || !rfc || !correoElectronico || !telefono) {
                return res.status(400).json({ error: "Missing fields." });
            };

            if (!Object.values(TipoSociedad).includes(razonSocial)) {
                return res.status(400).json({ error: "Invalid Razon Social." });
            }

            if (!validRFC(rfc)) {
                return res.status(400).json({ error: "Invalid RFC format." });
            };

            if (!validEmail(correoElectronico)) {
                return res.status(400).json({ error: "Invalid email format." });
            };

            if (!validPhone(telefono)) {
                return res.status(400).json({ error: "Invalid phone number format. Must be 10 digits." });
            };

            const client = await prisma.cliente.create({
                data: {
                    razonSocial,
                    nombreComercial,
                    rfc,
                    correoElectronico,
                    telefono
                }
            });

            return res.json(client);
        }
        catch(e){
            console.log('error:', e);
            return res.status(500).json({ error: 'There was an error creating the client' });
        }
    };

    async updateClient(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const {
                razonSocial,
                nombreComercial,
                rfc,
                correoElectronico,
                telefono
            } = req.body;

            if (!id) {
                return res.status(400).json({ error: "Missing client ID." });
            }

            const data: Record<string, string> = {};

            if (razonSocial) {
                if (!Object.values(TipoSociedad).includes(razonSocial)) {
                    return res.status(400).json({ error: "Invalid Razon Social." });
                }
                data.razonSocial = razonSocial;
            }

            if (nombreComercial) {
                data.nombreComercial = nombreComercial;
            }

            if (rfc) {
                if (!validRFC(rfc)) {
                    return res.status(400).json({ error: "Invalid RFC format." });
                }
                data.rfc = rfc;
            }

            if (correoElectronico) {
                if (!validEmail(correoElectronico)) {
                    return res.status(400).json({ error: "Invalid email format." });
                }
                data.correoElectronico = correoElectronico;
            }

            if (telefono) {
                if (!validPhone(telefono)) {
                    return res.status(400).json({ error: "Invalid phone number format. Must be 10 digits." });
                }
                data.telefono = telefono;
            }

            if (Object.keys(data).length === 0) {
                return res.status(400).json({ error: "No valid fields provided for update." });
            }

            const updatedClient = await prisma.cliente.update({
                where: { id },
                data
            });

            return res.json(updatedClient);
        } 
        catch (e) {
            console.error("Error:", e);
            return res.status(500).json({ error: "There was an error updating the client." });
        }
    };

    async deleteClientById(req: Request, res: Response){
        try{
            const { id } = req.params

            if(!id) {
                return res.status(404).json({ error: 'Missing Id' })
            }

            await prisma.cliente.delete({
                where: { id }
            })

            return res.json('User deleted Sucessfully');
        }
        catch(e){
            console.log('error:', e);
            return res.status(500).json({ error: 'There was an error the client' });
        }
    };
}

export default new clientController();