
import Etablissement from "@models/Etablissement.js";
import Joi from "joi";

const etablissementSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().valid("etablissement", "center").default("etablissement"),
});

const updateEtablissementSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().valid("etablissement", "center"),
});


const create = async (req, res) => {
    try {
        const { name, category } = await etablissementSchema.validateAsync(req.body);
        const etablissement = new Etablissement({ name, category });
        await etablissement.save();
        res.status(201).json({ _id: etablissement._id, name: etablissement.name, category: etablissement.category });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const updateById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        const { name, category } = await updateEtablissementSchema.validateAsync(req.body);
        const etablissement = await Etablissement.findByIdAndUpdate(req.params.id, { name, category }, { new: true });

        if (!etablissement)
            return res.status(404).json({ message: "Etablissement not found" });

        res.status(200).json({ _id: etablissement._id, name: etablissement.name, category: etablissement.category });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getAll = async (req, res) => {
    try {
        const etablissements = await Etablissement.find({}, { name: 1, _id: 1, category: 1 });
        res.status(200).json(etablissements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        const etablissement = await Etablissement.findById(req.params.id);

        if (!etablissement)
            return res.status(404).json({ message: "Etablissement not found" });

        res.status(200).json(etablissement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteById = async (req, res) => {
    if (!req.params.id)
        return res.status(400).json({ message: "Missing params" });

    try {
        await Etablissement.findByIdAndDelete(req.params.id);
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