import Session from '@models/Session.js';
import Joi from 'joi';

// Validation Schema with Joi
const sessionValidationSchema = Joi.object({
    isOpen: Joi.boolean().required(),
    availableStages: Joi.array()
        .items(Joi.string().valid(
            'stage_initiation',
            'stage_perfectionnement',
            'stage_pfe',
            'stage_ouvrier',
            'stage_technicien',
            'stage_ingenieur',
            'stage_pratique',
            'alternance'
        ))
        .required(),
});

// Get Current Session
export const getSession = async (req, res) => {
    try {
        const session = await Session.findOne();
        if (!session) return res.status(404).json({ message: 'Session not found.' });
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur', error: error.message });
    }
};

export const upsertSession = async (req, res) => {
    // Validate request body
    const { error } = sessionValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { isOpen, availableStages } = req.body;

    try {
        // Check if a session already exists
        let session = await Session.findOne();

        if (session) {
            // Update the existing session
            session.isOpen = isOpen;
            session.availableStages = availableStages;
        } else {
            // Create a new session if one doesn't exist
            session = new Session({ isOpen, availableStages });
        }

        const savedSession = await session.save();
        res.status(200).json({ message: 'Session mise à jour', session: savedSession });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la session', error: error.message });
    }
};

// Toggle Session Open/Close
export const toggleSession = async (req, res) => {
    try {
        const session = await Session.findOne();
        if (!session) return res.status(404).json({ message: 'Session not found.' });

        // Toggle the `isOpen` value
        session.isOpen = !session.isOpen;
        const updatedSession = await session.save();

        res.status(200).json({ message: `Session ${session.isOpen ? 'ouverte' : 'fermée'}`, session: updatedSession });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la session', error: error.message });
    }
};

export default { getSession, upsertSession, toggleSession };