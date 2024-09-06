
import Service from "@models/Service.js";
import Joi from "joi";

const serviceSchema = Joi.object({
    name: Joi.string().required(),
});

const updateServiceSchema = Joi.object({
    name: Joi.string().required(),
});


const create = async (req, res) => {
    try {
        const { name } = await serviceSchema.validateAsync(req.body);
        const service = new Service({ name });
        await service.save();
        res.status(201).json({ _id: service._id, name: service.name });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const updateById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        const { name } = await updateServiceSchema.validateAsync(req.body);
        const service = await Service.findByIdAndUpdate(req.params.id, { name }, { new: true });

        if (!service)
            return res.status(404).json({ message: "Service not found" });

        res.status(200).json({ _id: service._id, name: service.name });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getAll = async (req, res) => {
    try {
        const services = await Service.find({}, { name: 1, _id: 1 });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        const service = await Service.findById(req.params.id);

        if (!service)
            return res.status(404).json({ message: "Service not found" });

        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        await Service.findByIdAndDelete(req.params.id);
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    create,
    getAll,
    getById,
    deleteById,
    updateById
}