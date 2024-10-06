import React, { useState, useEffect } from 'react';
import { Switch, Checkbox, Button, notification, Spin } from 'antd';
import { LoadingOutlined, SaveFilled } from '@ant-design/icons';
import api from '@/services/api';

const stageTypes = {
    stage_initiation: 'Stage d\'initiation',
    stage_perfectionnement: 'Stage de perfectionnement',
    stage_pfe: 'Stage de fin d’étude (PFE)',
    stage_ouvrier: 'Stage ouvrier',
    stage_technicien: 'Stage technicien',
    stage_ingenieur: 'Stage ingénieur',
    stage_pratique: 'Stage pratique',
    alternance: 'Alternance',
};

const SessionManagement = () => {
    const [sessionOpen, setSessionOpen] = useState(false);
    const [selectedStages, setSelectedStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);

    // Fetch session data on component mount
    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await api.get('/session');
                const session = response.data;
                setSessionOpen(session.isOpen);
                setSelectedStages(session.availableStages || []);
                setLoading(false);
            } catch (error) {
                notification.error({
                    message: 'Erreur',
                    description: 'Impossible de récupérer les données de session.',
                });
            }
        };

        fetchSessionData();
    }, []);

    const handleSessionToggle = async (checked) => {
        try {
            setSessionOpen(checked);
            await api.post('/session/toggle');
            notification.info({
                message: checked ? 'Session Ouverte' : 'Session Fermée',
                description: checked
                    ? 'Les stages sont désormais ouverts.'
                    : 'La session de stages est maintenant fermée.',
            });
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Impossible de mettre à jour l\'état de la session.',
            });
        }
    };

    const handleStageChange = (checkedValues) => {
        setSelectedStages(checkedValues);
    };

    const handleSubmit = async () => {
        setSaveLoading(true);
        try {
            await api.post('/session/upsert', {
                isOpen: sessionOpen,
                availableStages: selectedStages,
            });

            notification.success({
                message: 'Configuration Enregistrée',
                description: `Session ${sessionOpen ? 'ouverte' : 'fermée'} avec les stages: ${selectedStages.map(stage => stageTypes[stage]).join(', ')}`,
            });
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Impossible d\'enregistrer la configuration de la session.',
            });
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold text-center mb-6">Gestion de la Session</h2>

            {loading ? (
                <div className="flex justify-center items-center w-full h-[50vh]">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 65 }} spin />} />
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg w-full max-w-3xl mx-auto mt-10">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-lg">Ouvrir/Fermer la Session</span>
                        <Switch
                            checked={sessionOpen}
                            onChange={handleSessionToggle}
                            checkedChildren="Ouverte"
                            unCheckedChildren="Fermée"
                            className="bg-green-500"
                        />
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Sélectionner les Types de Stages Disponibles</h3>
                        <Checkbox.Group
                            options={Object.keys(stageTypes).map(key => ({
                                label: stageTypes[key],
                                value: key,
                            }))}
                            value={selectedStages}
                            onChange={handleStageChange}
                            className="flex flex-col space-y-2"
                        />
                    </div>

                    <Button
                        loading={saveLoading}
                        type="primary"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
                        onClick={handleSubmit}
                        icon={<SaveFilled />}
                    >
                        Enregistrer les Modifications
                    </Button>
                </div>
            )}


        </>
    );
};

export default SessionManagement;
