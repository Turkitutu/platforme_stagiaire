import mongoose from "mongoose";

const etablissementSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["etablissement", "center"],
            default: "etablissement",
        },
    },
    {
        timestamps: true,
    }
);


export default mongoose.model("Etablissement", etablissementSchema);