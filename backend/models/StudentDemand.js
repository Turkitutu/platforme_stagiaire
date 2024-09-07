import mongoose from "mongoose";

const studentDemandSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        birthdate: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "female"],
            required: true,
        },
        nationality: {
            type: String,
            required: true,
        },
        cin: {
            type: String,
            required: true,
        },
        passport: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        etablissement: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Etablissement",
            required: false,
        },
        autre_etablissement: {
            type: String,
            required: false,
        },
        specialty: {
            type: String,
            required: true,
        },
        diplome: {
            type: String,
            required: true,
        },
        niveau: {
            type: String,
            required: true,
        },
        type_stage: {
            type: String,
            required: true,
            enum: [
                "stage_initiation",
                "stage_perfectionnement",
                "stage_pfe",
                "stage_ouvrier",
                "stage_technicien",
                "stage_ingenieur",
                "stage_pratique",
                "alternance",
            ],
        },
        pfe_subject: {
            type: String,
            required: false,
        },
        stage_duration: {
            type: Number,
            required: true,
        },
        attachments: {
            type: [String],
            required: false,
        }
    },
    {
        timestamps: true,  // Adds createdAt and updatedAt timestamps
    }
);

export default mongoose.model("StudentDemand", studentDemandSchema);
