import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    isOpen: {
        type: Boolean,
        required: true,
        default: false,
    },
    availableStages: {
        type: [String],
        enum: [
            'stage_initiation',
            'stage_perfectionnement',
            'stage_pfe',
            'stage_ouvrier',
            'stage_technicien',
            'stage_ingenieur',
            'stage_pratique',
            'alternance',
        ],
        default: [],
    },
}, {
    timestamps: true,
});

export default mongoose.model('Session', sessionSchema);
