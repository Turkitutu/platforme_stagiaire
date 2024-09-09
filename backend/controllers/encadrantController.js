
import Service from "@models/Service.js";
import Encadrant from "@models/Encadrant.js";

import Joi from "joi";

const encadrantSchema = Joi.object({
    name: Joi.string().required(),
    service: Joi.string().required(),
});

const updateEncadrantSchema = Joi.object({
    name: Joi.string(),
    service: Joi.string(),
});


const create = async (req, res) => {
    try {
        const { name, service } = await encadrantSchema.validateAsync(req.body);

        const _service = await Service.findById(service);
        if (!_service)
            return res.status(400).json({ message: "Invalid service" });

        const encadrant = new Encadrant({ name, service });
        await encadrant.save();
        res.status(201).json({
            _id: encadrant._id, name: encadrant.name, service: {
                _id: _service._id,
                name: _service.name
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const updateById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        const { name, service } = await updateEncadrantSchema.validateAsync(req.body);


        if (service) {
            const _service = await Service.findById(service);
            if (!_service)
                return res.status(400).json({ message: "Invalid service" });
        }

        const etablissement = await Encadrant.findByIdAndUpdate(req.params.id, { name, service }, { new: true }).populate("service", "name _id");
        if (!etablissement)
            return res.status(404).json({ message: "Encadrant not found" });

        res.status(200).json({ _id: etablissement._id, name: etablissement.name, service: etablissement.service });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getAll = async (req, res) => {
    try {
        const encadrants = await Encadrant.find({}, { name: 1, _id: 1, service: 1 }).populate("service", "name _id");
        res.status(200).json(encadrants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        const encadrants = await Encadrant.findById(req.params.id).populate("service", "name _id");

        if (!encadrants)
            return res.status(404).json({ message: "Etablissement not found" });

        res.status(200).json(encadrants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        await Encadrant.findByIdAndDelete(req.params.id);
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