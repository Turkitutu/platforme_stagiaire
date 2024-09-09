import mongoose from "mongoose";

const encadrantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Encadrant", encadrantSchema);