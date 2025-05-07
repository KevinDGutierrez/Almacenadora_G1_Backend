import { response } from "express";
import Client from "./client.model.js";
import mongoose from 'mongoose';

export const createClient = async (req, res = response) => {
    try {       
        const { name, email, phone, address } = req.body;

        const client = new Client({ name, email, phone, address });
        await client.save();


        return res.status(201).json({ success: true, msg: "Cliente creado correctamente",client });
    } catch (error) {
        console.error("Error en createClient", error)
        return res.status(500).json({ success: false, msg: "Error al crear Cliente", error });
    }
};

export const getClients = async (req, res) => {
    try {
        const clients = await Client.find({ status: true });
        return res.status(200).json(clients);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, msg: 'Error al obtener los clientes', error: error.message });
    }
};

export const getClientById = async (req, res) => {
    const { id } = req.params; 
    try {
      const client = await Client.findById(id);
      if (!client) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }
      res.json(client); 
    } catch (error) {
      console.error("Error al obtener cliente por ID", error);
      res.status(500).json({ message: "Error al obtener cliente", error });
    }
  };

export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body

        const updatedClient = await Client.findByIdAndUpdate(
            id,
            { name, email, phone, address },
            { new: true }
        );
        return res.status(200).json( {success: true, msg: "Cliente actualizado correctamente", client: updatedClient });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar el cliente', error });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: 'ID no válido' });
        }

        const client = await Client.findByIdAndUpdate(id, { status: false });
        if (!client) {
            return res.status(404).json({ success: false, msg: 'Cliente no encontrado' });
        }

        return res.status(200).json({ success: true, msg: 'Cliente deshabilitado correctamente' });
    } catch (error) {
        console.error("Error en deleteClient:", error);
        return res.status(500).json({ message: 'Error al eliminar el cliente', error });
    }
};


