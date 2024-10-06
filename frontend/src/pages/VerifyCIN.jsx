import React, { useState } from 'react';
import { Input, Button, Form, notification, Descriptions, Tag } from 'antd';
import api from '@/services/api';
import moment from 'moment';

const VerificationPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [alert, contextHolder] = notification.useNotification();
    const [resultData, setResultData] = useState(null);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await api.get('/demande_stage/verify/' + values.studentID);
            setResultData(response.data);
        } catch (error) {
            alert.error({
                message: 'Vérification échouée',
                description: 'Aucune demande trouvée pour ce numéro.',
            });
        }
        setLoading(false);
    };

    const backToVerify = () => {
        setResultData(null);
    }

    return (
        <>
            {contextHolder}
            <main className="bg-white w-full max-w-2xl p-8 mt-20 rounded-lg shadow-lg">
                <h1 className="text-2xl text-gray-800 text-center font-semibold mb-6">Vérification de Demande</h1>
                {resultData ?
                    resultData.status == "accepted" ? (
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Détails de la Demande</h2>
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Nom et Prénom">{resultData.fullname}</Descriptions.Item>
                                <Descriptions.Item label="CIN/Passport">{resultData.studentID}</Descriptions.Item>
                                <Descriptions.Item label="Date de soumission"><Tag color="blue">{moment(resultData.submitedDate).format("YYYY-MM-DD HH:mm:ss")}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Statut"><Tag color="green">Accepté</Tag></Descriptions.Item>
                                <Descriptions.Item label="Encadrant"><Tag>{resultData.stagaire.encadrant}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Departement"><Tag>{resultData.stagaire.service}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Date de confirmation"><Tag color="green">{moment(resultData.reviewDate).format("YYYY-MM-DD HH:mm:ss")}</Tag></Descriptions.Item>
                                {/* Add more details as needed */}
                            </Descriptions>
                            <Button className="mt-4" variant="outlined" onClick={backToVerify}> Retour</Button>
                            <Button className="mt-4  ms-2" type="primary" onClick={() => window.print()}>Imprimer</Button>


                        </div>
                    ) : resultData.status == "rejected" ? (
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Détails de la Demande</h2>
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Nom et Prénom">{resultData.fullname}</Descriptions.Item>
                                <Descriptions.Item label="CIN/Passport">{resultData.studentID}</Descriptions.Item>
                                <Descriptions.Item label="Date de soumission"><Tag>{moment(resultData.submitedDate).format("YYYY-MM-DD HH:mm:ss")}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Statut"><Tag color="red">Rejecté</Tag></Descriptions.Item>
                                <Descriptions.Item label="Date de confirmation"><Tag color="red">{moment(resultData.reviewDate).format("YYYY-MM-DD HH:mm:ss")}</Tag></Descriptions.Item>
                                {/* Add more details as needed */}
                            </Descriptions>
                            <Button className="mt-4" variant="outlined" onClick={backToVerify}> Retour</Button>
                        </div>
                    ) : <>
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Détails de la Demande</h2>
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Nom et Prénom">{resultData.fullname}</Descriptions.Item>
                                <Descriptions.Item label="CIN/Passport">{resultData.studentID}</Descriptions.Item>
                                <Descriptions.Item label="Date de soumission"><Tag>{moment(resultData.submitedDate).format("YYYY-MM-DD HH:mm:ss")}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Statut"><Tag color="orange">En cours de traitement</Tag></Descriptions.Item>
                                {/* Add more details as needed */}
                            </Descriptions>
                            <Button className="mt-4" variant="outlined" onClick={backToVerify}> Retour</Button>
                        </div>
                    </>
                    : (
                        <div className="flex justify-center items-center">
                            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                                <Form form={form} layout="vertical" onFinish={onFinish}>
                                    <Form.Item
                                        label="CIN/Passport"
                                        name="studentID"
                                        rules={[
                                            { required: true, message: 'Veuillez entrer votre CIN ou Passport' },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Entrez votre CIN ou Passport"
                                            className="border-gray-300 rounded-md p-2"
                                            size="large"
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md"
                                        >
                                            Vérifier
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    )}
            </main>
        </>
    );
};

export default VerificationPage;
