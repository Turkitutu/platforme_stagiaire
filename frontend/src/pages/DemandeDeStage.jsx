import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Upload, Spin, Radio, InputNumber, notification } from 'antd';
import { LoadingOutlined, UploadOutlined, ClockCircleOutlined } from '@ant-design/icons';

import 'antd/dist/reset.css';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

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

const DemandeDeStage = () => {
    const [selectedStageType, setSelectedStageType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [options, setOptions] = useState([]);
    const [alert, contextHolder] = notification.useNotification();
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const getData = async () => {
        try {
            const response = await api.get('/etablissement');

            const etablissementOptions = response.data
                .filter((item) => item.category === 'etablissement')
                .map((item) => ({
                    label: item.name,
                    value: item._id,
                }));

            const centerOptions = response.data
                .filter((item) => item.category === 'center')
                .map((item) => ({
                    label: item.name,
                    value: item._id,
                }));

            setOptions([
                {
                    label: 'Les établissements',
                    title: 'Les établissements',
                    options: etablissementOptions,
                },
                {
                    label: 'Centres de formation',
                    title: 'Centres de formation',
                    options: centerOptions,
                },
            ]);

            setLoading(false);
        } catch (error) {
            console.error(error);
            alert.error({
                message: 'Erreur',
                description: 'Une erreur s\'est produite lors du chargement des données. Veuillez réessayer plus tard.',
            });
        }
    };

    useEffect(() => {
        getData();
        form.setFieldValue('document_type', 'cin');
    }, []);

    const handleSubmit = (values) => {
        values.birthdate = new Date(values.birthdate).toISOString();
        delete values.document_type;

        setLoading(true);

        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (key === 'attachments') {
                value.forEach((file) => {
                    formData.append('attachments', file.originFileObj);
                });
            } else {
                formData.append(key, value);
            }
        });

        api.post('/demande_stage', formData).then(() => {
            alert.success({
                message: 'Succès',
                description: 'Votre demande a été soumise avec succès.',
            });

            navigate('/');
        }).catch((error) => {
            console.error(error);
            alert.error({
                message: 'Erreur',
                description: 'Une erreur s\'est produite lors de la soumission de votre demande. Veuillez réessayer plus tard.',
            });
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleStageTypeChange = (value) => {
        setSelectedStageType(value);
    };

    const onEtablissementSelectionMode = (mode) => {
        if (mode === 0) {
            form.setFieldValue('etablissement', { value: 'other', label: 'Autre' });
            form.setFieldValue('autreEtablissement', undefined);
            setShowOtherInput(true);
        } else {
            form.setFieldValue('etablissement', undefined);
            form.setFieldValue('autreEtablissement', undefined);
            setShowOtherInput(false);
        }
    };

    return (
        <>
            {contextHolder}
            <main className="bg-white w-full max-w-2xl p-8 mt-20 rounded-lg shadow-lg">
                <h1 className="text-2xl text-gray-800 text-center font-semibold mb-6">Demande de Stage</h1>
                {loading ? (
                    <div className="flex justify-center items-center w-full h-[50vh]">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 65 }} spin />} />
                    </div>
                ) : (
                    <div>
                        <p className="mb-4 text-gray-600">
                            Bienvenue sur le portail de demande de stage. Veuillez remplir le formulaire ci-dessous pour postuler.
                        </p>

                        <Form layout="vertical" onFinish={handleSubmit} form={form}>
                            <Form.Item
                                name="first_name"
                                label="Nom"
                                rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
                            >
                                <Input placeholder="Entrez votre nom" className="rounded-md" />
                            </Form.Item>

                            <Form.Item
                                name="last_name"
                                label="Prénom"
                                rules={[{ required: true, message: 'Veuillez entrer votre prénom' }]}
                            >
                                <Input placeholder="Entrez votre prénom" className="rounded-md" />
                            </Form.Item>

                            <Form.Item
                                name="birthdate"
                                label="Date de naissance"
                                rules={[{ required: true, message: 'Veuillez sélectionner votre date de naissance' }]}
                            >
                                <DatePicker className="w-full rounded-md" />
                            </Form.Item>

                            <Form.Item
                                name="gender"
                                label="Genre"
                                rules={[{ required: true, message: 'Veuillez sélectionner votre genre' }]}
                            >
                                <Radio.Group>
                                    <Radio value="male">Homme</Radio>
                                    <Radio value="female">Femme</Radio>
                                </Radio.Group>
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
                                name="document_type"
                                label="Type de document"
                                rules={[{ required: true, message: 'Veuillez sélectionner CIN ou Passeport' }]}
                            >
                                <Radio.Group>
                                    <Radio value="cin">CIN</Radio>
                                    <Radio value="passport">Passeport</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                shouldUpdate={(prevValues, currentValues) => prevValues.document_type !== currentValues.document_type}
                            >
                                {({ getFieldValue }) => getFieldValue('document_type') === 'passport' ? (
                                    <Form.Item
                                        name="passport"
                                        label="Passeport"
                                        rules={[{ required: true, message: 'Veuillez entrer votre passeport' }]}
                                    >
                                        <Input placeholder="Entrez votre passeport" className="rounded-md" />
                                    </Form.Item>
                                ) : (
                                    <Form.Item
                                        name="cin"
                                        label="CIN"
                                        rules={[{ required: true, message: 'Veuillez entrer votre CIN' }]}
                                    >
                                        <Input placeholder="Entrez votre CIN" className="rounded-md" />
                                    </Form.Item>
                                )}
                            </Form.Item>


                            <Form.Item
                                name="phone"
                                label="Numéro de téléphone"
                                rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone' }]}
                            >
                                <Input placeholder="Entrez votre numéro de téléphone" className="rounded-md" />
                            </Form.Item>

                            <Form.Item
                                name="address"
                                label="Adresse"
                                rules={[{ required: true, message: 'Veuillez entrer votre adresse' }]}
                            >
                                <Input placeholder="Entrez votre adresse" className="rounded-md" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Veuillez entrer votre adresse email' }]}
                            >
                                <Input placeholder="Entrez votre adresse email" className="rounded-md" />
                            </Form.Item>

                            <div className="relative">
                                <Form.Item
                                    name="etablissement"
                                    label="Établissement d'enseignement"
                                    rules={[{ required: true, message: 'Veuillez entrer votre établissement d\'enseignement' }]}
                                >
                                    <Select
                                        showSearch
                                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                        placeholder="Sélectionnez votre établissement"
                                        className="rounded-md"
                                        disabled={showOtherInput}
                                        options={options}
                                    />
                                </Form.Item>
                                {!showOtherInput && (
                                    <span className="absolute ms-2 text-gray-500 top-16 right-1" style={{ fontSize: 12 }}>
                                        Pas trouvé votre établissement ?{' '}
                                        <span
                                            className="text-blue-500 cursor-pointer hover:text-blue-650"
                                            role="button"
                                            tabIndex="0"
                                            onClick={() => onEtablissementSelectionMode(0)}
                                        >
                                            Définir un autre
                                        </span>
                                    </span>
                                )}
                            </div>

                            {showOtherInput && (
                                <div className="relative">
                                    <Form.Item
                                        name="autre_etablissement"
                                        label="Autre établissement"
                                        rules={[{ required: true, message: 'Veuillez entrer le nom de votre établissement' }]}
                                    >
                                        <Input placeholder="Entrez le nom de votre établissement" className="rounded-md" />
                                    </Form.Item>
                                    <span className="absolute ms-2 text-gray-500 top-16 right-1" style={{ fontSize: 12 }}>
                                        Revenir à la sélection{' '}
                                        <span
                                            className="text-blue-500 cursor-pointer hover:text-blue-650"
                                            role="button"
                                            tabIndex="0"
                                            onClick={() => onEtablissementSelectionMode(1)}
                                        >
                                            ici
                                        </span>
                                    </span>
                                </div>
                            )}

                            <Form.Item
                                className="pt-4"
                                name="specialty"
                                label="Spécialisation"
                                rules={[{ required: true, message: 'Veuillez entrer votre spécialisation' }]}
                            >
                                <Input placeholder="Entrez votre spécialisation" className="rounded-md" />
                            </Form.Item>

                            <Form.Item
                                name="diplome"
                                label="Diplôme"
                                rules={[{ required: true, message: 'Veuillez entrer votre diplôme' }]}
                            >
                                <Input placeholder="Entrez votre diplôme" className="rounded-md" />
                            </Form.Item>

                            <Form.Item
                                name="niveau"
                                label="Niveau d'étude"
                                rules={[{ required: true, message: 'Veuillez entrer votre niveau d\'étude' }]}
                            >
                                <Input placeholder="Entrez votre niveau d'étude" className="rounded-md" />
                            </Form.Item>

                            <Form.Item
                                name="type_stage"
                                label="Type de stage"
                                rules={[{ required: true, message: 'Veuillez sélectionner le type de stage' }]}
                            >
                                <Select

                                    placeholder="Sélectionnez le type de stage"
                                    className="rounded-md"
                                    options={Object.entries(stageTypes).map(([key, value]) => ({
                                        value: key,
                                        label: value,
                                    }))}
                                    onChange={handleStageTypeChange}
                                />
                            </Form.Item>

                            {selectedStageType === 'stage_pfe' && (
                                <Form.Item
                                    name="pfe_subject"
                                    label="Sujet"
                                    rules={[{ required: true, message: 'Veuillez entrer votre sujet de PFE' }]}
                                >
                                    <Input.TextArea placeholder="Proposer un sujet" rows={4} className="rounded-md" />
                                </Form.Item>
                            )}

                            <Form.Item
                                name="stage_duration"
                                label="Durée de stage (en mois)"
                                rules={[{ required: true, message: 'Veuillez entrer la durée de votre stage' }]}
                            >
                                <InputNumber prefix={<ClockCircleOutlined />} step={1} suffix="Mois" min={1} placeholder="Entrez la durée de votre stage" className="w-52 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                name="attachments"
                                label="Pièce Jointe (Demande de stage & Une carte séjour si vous êtes étranger)"
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
                    </div>
                )}
            </main>
        </>
    );
};

export default DemandeDeStage;
