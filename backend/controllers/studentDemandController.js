import StudentDemand from "@models/StudentDemand.js";
import Etablissement from "@models/Etablissement.js";
import Joi from "joi";

const studentDemandSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    birthdate: Joi.date().required(),
    gender: Joi.string().valid("male", "female").required(),
    nationality: Joi.string().required(),
    cin: Joi.string(),
    passport: Joi.string(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().required(),
    etablissement: Joi.string(),
    autre_etablissement: Joi.string(),
    specialty: Joi.string().required(),
    diplome: Joi.string().required(),
    niveau: Joi.string().required(),
    type_stage: Joi.string().valid("stage_initiation", "stage_perfectionnement", "stage_pfe", "stage_ouvrier", "stage_technicien", "stage_ingenieur", "stage_pratique", "alternance").required(),
    pfe_subject: Joi.string().when(
        'type_stage', {
        is: 'stage_pfe',
        then: Joi.string().required()
    }
    ),
    stage_duration: Joi.number().required(),
    attachments: Joi.array().items(
        Joi.object({
            originalname: Joi.string().required(),
            path: Joi.string().required(),
            mimetype: Joi.string().valid(
                'application/pdf',
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ).required(),
            size: Joi.number().max(20000000).required()
        })
    ).required(),
})
    .xor("cin", "passport").xor("etablissement", "autre_etablissement");



const create = async (req, res) => {
    try {

        const attachments = req.files.map(file => ({
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path
        }));

        const studentDemand = await studentDemandSchema.validateAsync({ ...req.body, attachments });

        if (studentDemand.etablissement) {
            const etablissement = await Etablissement.findById(studentDemand.etablissement);
            if (!etablissement)
                return res.status(400).json({ message: "Etablissement not found" });
        }

        studentDemand.attachments = attachments.map(({ path }) => path);

        const newStudentDemand = new StudentDemand(studentDemand);
        await newStudentDemand.save();
        res.status(201).json({ message: "Student demande created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getAll = async (req, res) => {
    try {
        const studentDemands = await StudentDemand.find().populate("etablissement");
        res.status(200).json(studentDemands);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export default { create, getAll };