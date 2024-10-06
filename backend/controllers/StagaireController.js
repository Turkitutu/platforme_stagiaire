
import Stagaire from "@models/Stagaire.js";
import Encadrant from "@models/Encadrant.js"
import Service from "@models/Service.js"

import Joi from "joi";



const updateStagaireSchema = Joi.object({
    encadrant: Joi.string().required(),
    service: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
});



const updateById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        const toUpdateData = await updateStagaireSchema.validateAsync(req.body);

        const stagaire = await Stagaire.findById(req.params.id);
        if (!stagaire)
            return res.status(400).json({ message: "Invalid stagaire" });


        if (!toUpdateData.encadrant) {
            const encadrant = await Encadrant.findById(req.params.id);
            if (!encadrant)
                return res.status(400).json({ message: "Encadrant not found" });
        }

        if (!toUpdateData.service) {
            const service = await Service.findById(req.params.id);
            if (!service)
                return res.status(400).json({ message: "Service not found" });
        }

        res.status(200).json({ result: "Updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getAll = async (req, res) => {
    try {
        const stagaires = await Stagaire.find().populate("service", "name _id").populate("encadrant", "name _id").populate("studentDemand");
        res.status(200).json(stagaires);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        const stagaire = await Stagaire.findById(req.params.id).populate("service", "name _id").populate("encadrant", "name _id").populate("studentDemand");

        if (!stagaire)
            return res.status(404).json({ message: "Etablissement not found" });

        res.status(200).json(stagaire);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        await Stagaire.findByIdAndUpdate(req.params.id, { status: "inactive" });
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    getAll,
    getById,
    deleteById,
    updateById
}