import React, { useState } from 'react';
import { Input, Button, Form, notification, Descriptions, Tag } from 'antd';
import api from '@/services/api';
import moment from 'moment';
import { PDFDocument, rgb } from 'pdf-lib'; // Import pdf-lib

import { PrinterOutlined } from '@ant-design/icons';


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

    const splitTextIntoLines = (text, maxLineLength) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach((word) => {
            // If adding the next word exceeds the max line length, push the current line to lines
            if ((currentLine + word).length > maxLineLength) {
                lines.push(currentLine.trim()); // Trim to remove any extra space
                currentLine = word + ' '; // Start a new line with the current word
            } else {
                currentLine += word + ' '; // Continue building the current line
            }
        });

        // Push the last line
        if (currentLine) {
            lines.push(currentLine.trim());
        }

        return lines;
    };

    // Function to modify and print the PDF
    const modifyAndPrintPdf = async () => {
        const existingPdfBytes = await fetch('/fiche_reponse.pdf').then(res => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        const { height } = firstPage.getSize();

        firstPage.drawText(`${resultData.stagaire.encadrant}`, {
            x: 120,
            y: height - 480,
            size: 12,
            color: rgb(0, 0, 0),
        });

        // Draw Service (break it into lines)
        const serviceText = resultData.stagaire.service;
        const maxLineLength = 20;  // Break after 10 characters
        const lines = splitTextIntoLines(serviceText, maxLineLength);

        let currentY = height - 460;  // Starting Y position for the service text
        lines.forEach((line, index) => {
            firstPage.drawText(line, {
                x: 300,
                y: currentY - (index * 12),  // Move each line down by 12 units
                size: 10,
                color: rgb(0, 0, 0),
            });
        });


        firstPage.drawText(`${moment(resultData.stagaire.startDate).format('YYYY-MM-DD')}`, {
            x: 460,
            y: height - 480,
            size: 10,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${moment(resultData.stagaire.endDate).format('YYYY-MM-DD')}`, {
            x: 460,
            y: height - 500,
            size: 10,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${resultData.niveau}`, {
            x: 430,
            y: height - 340,
            size: 10,
            color: rgb(0, 0, 0),
        });


        firstPage.drawText(`${resultData.etablissement}`, {
            x: 190,
            y: height - 210,
            size: 10,
            color: rgb(0, 0, 0),
        });

        const modifiedPdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Open and print the PDF
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    };

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
                            </Descriptions>
                            <Button className="mt-4" variant="outlined" onClick={backToVerify}> Retour</Button>
                            <Button className="mt-4 ms-2" type="primary" icon={<PrinterOutlined />} onClick={modifyAndPrintPdf}>Imprimer fiche de reponse</Button>
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
                            </Descriptions>
                            <Button className="mt-4" variant="outlined" onClick={backToVerify}> Retour</Button>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Détails de la Demande</h2>
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Nom et Prénom">{resultData.fullname}</Descriptions.Item>
                                <Descriptions.Item label="CIN/Passport">{resultData.studentID}</Descriptions.Item>
                                <Descriptions.Item label="Date de soumission"><Tag>{moment(resultData.submitedDate).format("YYYY-MM-DD HH:mm:ss")}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Statut"><Tag color="orange">En cours de traitement</Tag></Descriptions.Item>
                            </Descriptions>
                            <Button className="mt-4" variant="outlined" onClick={backToVerify}> Retour</Button>
                        </div>
                    )
                    : (
                        <div className="flex justify-center items-center">
                            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                                <Form form={form} layout="vertical" onFinish={onFinish}>
                                    <Form.Item
                                        label="CIN/Passport"
                                        name="studentID"
                                        rules={[{ required: true, message: 'Veuillez entrer votre CIN ou Passport' }]}
                                    >
                                        <Input placeholder="Entrez votre CIN ou Passport" className="border-gray-300 rounded-md p-2" size="large" />
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
