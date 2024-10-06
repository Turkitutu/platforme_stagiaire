import User from "@models/User.js";
import Joi from "joi";

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    isAdmin: Joi.boolean().required(),
});

const create = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = await userSchema.validateAsync(req.body);

        const user = new User({ name, email, password, isAdmin });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getAll = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}



const updateById = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        user.name = name;
        user.email = email;
        user.password = password;
        user.isAdmin = isAdmin;

        await user.save();

        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deleteById = async (req, res) => {
    try {
        if (!req.params.id)
            return res.status(400).json({ message: "Missing params" });

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export default { create, getAll, deleteById, updateById };