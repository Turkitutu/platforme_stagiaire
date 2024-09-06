import mongoose from "mongoose";

const etudiantSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: true,
        },
        prenom: {
            type: String,
            required: true,
        },
        sexe: {
            type: String,
            required: true,
            enum: ["Male", "Female"], 
        },
        date_ns: {
            type: Date,
            required: true,
        },
        nationalite: {
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
        tel: {
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
            unique: true,
        },
        etablissement: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Etablissement",  
            required: true,
        },
        specialite: {
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
        sujet: {
            type: String,
            required: true,
        },
        duree: {
            type: Number,
            required: true,
        },
        piece_jointe_path: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Etudiant", etudiantSchema);