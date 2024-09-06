import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


export default mongoose.model("Service", serviceSchema);