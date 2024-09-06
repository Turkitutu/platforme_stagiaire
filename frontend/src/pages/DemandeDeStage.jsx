import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Upload } from 'antd';

import 'antd/dist/reset.css';

const { Option } = Select;

import { UploadOutlined } from '@ant-design/icons';

import Navbar from '../components/Navbar';


const stageTypes = {
    stage_initiation: 'Stage d\'initiation',
    stage_perfectionnement: 'Stage de perfectionnement',
    stage_pfe: 'Stage de fin d’étude (PFE)',
    stage_ouvrier: 'Stage ouvrier',
    stage_technicien: 'Stage technicien',
    stage_ingenieur: 'Stage ingénieur',
    stage_pratique: 'Stage pratique',
    alternance: 'Alternance',
}

const DemandeDeStage = () => {
    const [selectedStageType, setSelectedStageType] = useState(null);

    const onFinish = (values) => {
        console.log('Form values:', values);
    };

    const handleStageTypeChange = (value) => {
        setSelectedStageType(value);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <Navbar />

            <main className="bg-white w-full max-w-2xl p-8 mt-20 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Demande de Stage</h1>
                <p className="mb-4">Bienvenue sur le portail de demande de stage. Veuillez remplir le formulaire ci-dessous pour postuler.</p>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        label="Nom"
                        rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
                    >
                        <Input placeholder="Entrez votre nom" className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        name="surname"
                        label="Prénom"
                        rules={[{ required: true, message: 'Veuillez entrer votre prénom' }]}
                    >
                        <Input placeholder="Entrez votre prénom" className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        name="dob"
                        label="Date de naissance"
                        rules={[{ required: true, message: 'Veuillez sélectionner votre date de naissance' }]}
                    >
                        <DatePicker className="w-full rounded-md" />
                    </Form.Item>

                    <Form.Item
                        name="nationality"
                        label="Nationalité"
                        rules={[{ required: true, message: 'Veuillez sélectionner votre nationalité' }]}
                    >
                        <Select placeholder="Sélectionnez votre nationalité" className="rounded-md">
                            <Option value="Tunisian">Tunisienne</Option>
                            <Option value="Other">Autre</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Numéro de téléphone"
                        rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone' }]}
                    >
                        <Input placeholder="Entrez votre numéro de téléphone" className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Veuillez entrer votre adresse email' }]}
                    >
                        <Input placeholder="Entrez votre adresse email" className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        name="institution"
                        label="Établissement d'enseignement"
                        rules={[{ required: true, message: 'Veuillez entrer votre établissement d\'enseignement' }]}
                    >
                        <Input placeholder="Entrez votre établissement" className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        name="specialization"
                        label="Spécialisation"
                        rules={[{ required: true, message: 'Veuillez entrer votre spécialisation' }]}
                    >
                        <Input placeholder="Entrez votre spécialisation" className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        name="degree"
                        label="Diplôme"
                        rules={[{ required: true, message: 'Veuillez entrer votre diplôme' }]}
                    >
                        <Input placeholder="Entrez votre diplôme" className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        name="stageType"
                        label="Type de stage"
                        rules={[{ required: true, message: 'Veuillez sélectionner votre type de stage' }]}
                    >
                        <Select
                            placeholder="Sélectionnez votre type de stage"
                            onChange={handleStageTypeChange}
                            className="rounded-md"
                        >
                            {Object.keys(stageTypes).map((key) => (
                                <Option key={key} value={key}>{stageTypes[key]}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedStageType === 'stage_pfe' && (
                        <Form.Item
                            name="pfeSubject"
                            label="Sujet"
                            rules={[{ required: true, message: 'Veuillez entrer votre sujet de PFE' }]}
                        >
                            <Input.TextArea placeholder="Proposer un sujet" rows={4} className="rounded-md" />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="pieceJointe"
                        label="Pièce Jointe (Demande de stage et une carte séjour si vous êtes étranger)"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
                        rules={[{ required: true, message: 'Veuillez télécharger le document nécessaire' }]}
                    >
                        <Upload name="file" beforeUpload={() => false} listType="picture">
                            <Button icon={<UploadOutlined />}>Cliquez pour télécharger</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full mt-4 rounded-md">
                            Soumettre la demande
                        </Button>
                    </Form.Item>
                </Form>
            </main>
        </div>
    );
};

export default DemandeDeStage;
