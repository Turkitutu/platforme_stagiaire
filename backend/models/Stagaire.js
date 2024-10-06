import mongoose from "mongoose";

const stagaireSchema = new mongoose.Schema(
    {
        encadrant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Encadrant",
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        studentDemand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentDemand",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Stagaire", stagaireSchema);