import StudentDemand from "@models/StudentDemand.js";
import Etablissement from "@models/Etablissement.js";
import Stagaire from "@models/Stagaire.js";
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

const acceptDemandSchema = Joi.object({
    encadrant: Joi.string().required(),
    service: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
});

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

        const filters = {};
        if (req.query.status)
            filters["status"] = String(req.query.status)

        const studentDemands = await StudentDemand.find(filters).populate("etablissement");
        res.status(200).json(studentDemands);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const accept = async (req, res) => {
    try {
        if (!req.params.id)
            return res.status(400).json({ message: "Student demand id is required" });

        const data = await acceptDemandSchema.validateAsync(req.body);

        const studentDemand = await StudentDemand.findById(req.params.id);
        if (!studentDemand)
            return res.status(404).json({ message: "Student demand not found" });

        await StudentDemand.findByIdAndUpdate(req.params.id, { status: "accepted" });

        const stagaire = new Stagaire({
            startDate: data.startDate,
            endDate: data.endDate,
            encadrant: data.encadrant,
            service: data.service,
            studentDemand: studentDemand._id
        });

        await stagaire.save();

        res.status(200).json({ message: "Student demand accepted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const reject = async (req, res) => {
    try {
        const studentDemand = await StudentDemand.findById(req.params.id);
        if (!studentDemand)
            return res.status(404).json({ message: "Student demand not found" });

        studentDemand.status = "rejected";
        await studentDemand.save();
        res.status(200).json({ message: "Student demand rejected successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const verify = async (req, res) => {
    const student = req.params.studentID;

    if (!student)
        return res.status(400).json({ message: "CIN/Passport is required paramater" });

    try {
        const studentDemand = await StudentDemand.findOne({ $or: [{ cin: student }, { passport: student }] }).populate('etablissement');
        if (!studentDemand)
            return res.status(404).json({ message: "Student demand not found" });

        if (studentDemand.status == "accepted") {
            const stagaire = await Stagaire.findOne({ studentDemand: studentDemand._id }).populate("service", "name").populate("encadrant", "name")
            const data = {
                fullname: `${studentDemand.first_name} ${studentDemand.last_name}`,
                studentID: studentDemand.cin || studentDemand.passport,
                submitedDate: studentDemand.createdAt,
                reviewedDate: stagaire.createdAt,
                etablissement: studentDemand.autre_etablissement || studentDemand.etablissement.name,
                niveau: studentDemand.niveau,
                stagaire: {
                    startDate: stagaire.startDate,
                    endDate: stagaire.endDate,
                    encadrant: stagaire.encadrant.name,
                    service: stagaire.service.name,
                },
                status: "accepted"
            }
            return res.status(200).json(data);
        }
        else if (studentDemand.status == "rejected") {
            const data = {
                fullname: `${studentDemand.first_name} ${studentDemand.last_name}`,
                studentID: studentDemand.cin || studentDemand.passport,
                submitedDate: studentDemand.createdAt,
                reviewedDate: studentDemand.updatedAt,
                status: "rejected"
            }
            return res.status(200).json(data);
        }
        else {
            const data = {
                fullname: `${studentDemand.first_name} ${studentDemand.last_name}`,
                studentID: studentDemand.cin || studentDemand.passport,
                submitedDate: studentDemand.createdAt,
                status: "active"
            }
            return res.status(200).json(data);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export default { create, getAll, accept, reject, verify };