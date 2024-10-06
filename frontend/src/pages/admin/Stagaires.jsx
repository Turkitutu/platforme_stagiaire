import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, DatePicker, Descriptions, Divider, Dropdown, Form, Input, Menu, Modal, notification, Select, Space, Table, Tag, Upload } from 'antd';
import { SearchOutlined, PaperClipOutlined, DownOutlined, PlusCircleTwoTone, MinusCircleTwoTone, PrinterOutlined } from '@ant-design/icons';
import api from '@/services/api';
import moment from 'moment';
import { PDFDocument, rgb } from 'pdf-lib'; // Import pdf-lib

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

const stageTypesColors = {
    stage_initiation: 'orange',
    stage_perfectionnement: 'green',
    stage_pfe: 'blue',
    stage_ouvrier: 'purple',
    stage_technicien: 'red',
    stage_ingenieur: 'cyan',
    stage_pratique: 'geekblue',
    alternance: 'magenta',
}

const Stagaires = () => {

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [data, setData] = useState([]);
    const [encadrants, setEncadrants] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const getStagaires = async () => {
        try {
            const response = await api.get('/stagaire?status=active');
            const data = response.data.map((item) => {
                return {
                    ...item,
                    details: item.studentDemand,
                    key: item._id,
                    identity: String(item.studentDemand.cin) || String(item.studentDemand.passport),
                    firstname: item.studentDemand.first_name,
                    lastname: item.studentDemand.last_name,
                    diplome: item.studentDemand.diplome,
                    specialty: item.studentDemand.specialty,
                    type_stageLabel: stageTypes[item.studentDemand.type_stage],
                    type_stageColor: stageTypesColors[item.studentDemand.type_stage],
                    attachments: item.studentDemand.attachments.map((path) => {
                        const completeFileName = path.split('\\').pop();
                        const arrayFilename = completeFileName.split('-');
                        arrayFilename.shift();
                        const filename = arrayFilename.join('-');
                        return {
                            uid: path,
                            name: filename,
                            status: 'done',
                            url: `${import.meta.env.VITE_BASE_URL}/${path}`,
                        };
                    }),
                };
            });
            setData(data);

            const encadrantsResponse = await api.get('/encadrant');
            setEncadrants(encadrantsResponse.data);

            const servicesResponse = await api.get('/service');
            setServices(servicesResponse.data);

            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const serviceList = useMemo(
        () => services.map((service) => ({
            label: service.name,
            value: service._id,
        })), [services]
    );

    const encadrantList = useMemo(
        () => encadrants
            .filter((encadrant) => encadrant.service._id == selectedService)
            .map((encadrant) => {
                return {
                    label: encadrant.name,
                    value: encadrant._id,
                }
            }), [encadrants, selectedService])


    useEffect(() => {
        getStagaires();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [selectedDemandePDF, setSelectedDemandePDF] = useState(null);

    const [alert, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    const confirmReject = (record) => {
        Modal.confirm({
            title: `Rejeter la demande de ${record.fullname}`,
            content: <>Voulez-vous vraiment rejeter la demande de <b>{record.fullname}</b> ?</>,
            okText: 'Rejeter',
            width: 500,
            okType: 'danger',
            cancelText: 'Annuler',
            onOk: () => handleReject(record),
        });
    }

    const handleReject = (record) => {
        api.post(`/demande_stage/reject/${record._id}`)
            .then(() => {
                setData(data.filter(item => item._id !== record._id));
                alert.success({
                    message: 'Demande rejeté',
                    description: 'Demande a rejeté avec succès',
                });
            })
            .catch(error => {
                console.error(error);
                alert.error({
                    message: 'Erreur',
                    description:
                        'Erreur lors de la rejet de la demande',
                });
            });
    };

    const handleAccept = (record) => {
        setSelectedDemande(record);
        form.setFieldValue('name', record.name);
        form.setFieldValue('category', record.category);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setSelectedDemande(null);
        setIsModalOpen(false);
    };


    const handleSubmitAccept = (values, record) => {
        values.startDate = values.startDate.format('YYYY-MM-DD');
        values.endDate = values.endDate.format('YYYY-MM-DD');

        api.post(`/demande_stage/accept/${record._id}`, values)
            .then(response => {
                setData(data.filter(item => item._id !== record._id));
                alert.success({
                    message: 'La demande a été acceptée',
                    description: `La demande de ${record.fullname} a été acceptée`,
                });
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error(error);
                alert.error({
                    message: 'Erreur',
                    description:
                        `Erreur en acceptant la demande de ${record.fullname}`,
                });
            })
            .finally(() => {
                setLoadingSubmit(false);
            });
    };

    const onFinish = (values) => {
        handleSubmitAccept(values, selectedDemande);
    };


    const handleSearch = (
        selectedKeys,
        confirm,
        dataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleResetSearch = (clearFilters, confirm, dataIndex) => {
        clearFilters();
        confirm();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex, label) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={label}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 120 }}
                    >
                        Recherche
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleResetSearch(clearFilters, confirm, dataIndex)}
                        size="small"
                        style={{ width: 100 }}
                    >
                        Réinitialiser
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Annuler
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });


    const columns = [
        {
            title: 'Nom',
            dataIndex: 'lastname',
            key: 'lastname',
            width: '20%',
            sorter: (a, b) => a.lastname.length - b.lastname.length,
            onFilter: (value, record) => record.lastname.indexOf(value) === 0,
            ...getColumnSearchProps('lastname', 'Rechercher par nom'),
        },
        {
            title: 'Prénom',
            dataIndex: 'firstname',
            key: 'firstname',
            width: '20%',
            sorter: (a, b) => a.firstname.length - b.firstname.length,
            onFilter: (value, record) => record.firstname.indexOf(value) === 0,
            ...getColumnSearchProps('firstname', 'Rechercher par prénom'),
        },
        {
            title: 'CIN/Passport',
            dataIndex: 'identity',
            key: 'identity',
            width: '20%',
            ...getColumnSearchProps('identity', 'Rechercher par CIN/Passport'),
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Diplôme',
            dataIndex: 'diplome',
            key: 'diplome',
            width: '20%',
            sorter: (a, b) => a.diplome.length - b.diplome.length,
            ...getColumnSearchProps('diplome', 'Rechercher par diplome'),
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Spécialité',
            dataIndex: 'specialty',
            key: 'specialite',
            width: '20%',
            sorter: (a, b) => a.specialty.length - b.specialty.length,
            ...getColumnSearchProps('specialty', 'Rechercher par specialite'),
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle" >
                    <div className="flex justify-center">
                        <Dropdown overlay={menu}>
                            <Button onClick={() => setSelectedDemandePDF(record)} className="bg-blue-400 hover:bg-blue-600 text-white font-semibold flex items-center">
                                Documents <PrinterOutlined className="ml-2" />
                            </Button>
                        </Dropdown>
                    </div>
                </Space >
            ),
        },
    ];

    const printAttestation = async () => {
        const existingPdfBytes = await fetch('/attestation_stage.pdf').then(res => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const fullname = selectedDemandePDF.firstname + ' ' + selectedDemandePDF.lastname;
        const etablissement = selectedDemandePDF.studentDemand.etablissement ? selectedDemandePDF.studentDemand.etablissement.name : selectedDemandePDF.studentDemand.autre_etablissement
        const { height } = firstPage.getSize();
        firstPage.drawText(`${fullname}`, {
            x: 200,
            y: height - 330,
            size: 12,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${etablissement}`, {
            x: 200,
            y: height - 370,
            size: 11,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${moment(selectedDemandePDF.startDate).format("YYYY-MM-DD")}`, {
            x: 250,
            y: height - 465,
            size: 11,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${moment(selectedDemandePDF.endDate).format("YYYY-MM-DD")}`, {
            x: 350,
            y: height - 465,
            size: 11,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedDemandePDF.service.name, {
            x: 200,
            y: height - 500,
            size: 11,
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

    const printTransmission = async () => {
        const existingPdfBytes = await fetch('/lettre_transmission.pdf').then(res => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const fullname = selectedDemandePDF.firstname + ' ' + selectedDemandePDF.lastname;
        const etablissement = selectedDemandePDF.studentDemand.etablissement ? selectedDemandePDF.studentDemand.etablissement.name : selectedDemandePDF.studentDemand.autre_etablissement
        const { height } = firstPage.getSize();


        firstPage.drawText(selectedDemandePDF.service.name, {
            x: 180,
            y: height - 325,
            size: 11,
            color: rgb(0, 0, 0),
        });

        const stage_type = stageTypes[selectedDemandePDF.studentDemand.type_stage];

        firstPage.drawText(stage_type, {
            x: 200,
            y: height - 350,
            size: 11,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${etablissement}`, {
            x: 200,
            y: height - 380,
            size: 10,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${selectedDemandePDF.studentDemand.specialty}`, {
            x: 165,
            y: height - 410,
            size: 11,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${fullname}`, {
            x: 180,
            y: height - 435,
            size: 11,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${moment(selectedDemandePDF.startDate).format("YYYY-MM-DD")}`, {
            x: 200,
            y: height - 510,
            size: 11,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${moment(selectedDemandePDF.endDate).format("YYYY-MM-DD")}`, {
            x: 300,
            y: height - 510,
            size: 11,
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


    const menu = (
        <Menu>
            <Menu.Item key="document1" onClick={printAttestation}>
                Attestation de stage
            </Menu.Item>
            <Menu.Item key="document2" onClick={printTransmission}>
                Lettre de transmission
            </Menu.Item>
        </Menu>
    );

    return <>
        <Modal
            title={<>Accepter la demande de <span className='text-lime-600'>{selectedDemande ? selectedDemande.fullname : ''}</span></>}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Annuler
                </Button>,
                <Button key="submit" loading={loadingSubmit} type="primary" onClick={() => form.submit()}>
                    Accepter
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}

            >
                {/* Assign Service */}
                <Form.Item
                    label="Affectation au Service"
                    name="service"
                    rules={[
                        { required: true, message: 'Veuillez affecter un service' },
                    ]}
                >
                    <Select
                        size='large'
                        placeholder="Choisir un service"
                        className="w-full"
                        options={serviceList}
                        onChange={setSelectedService}
                    />
                </Form.Item>

                <Form.Item
                    label="Encadrant Responsable"
                    name="encadrant"
                    rules={[
                        { required: true, message: 'Veuillez affecter un encadrant' },
                    ]}
                >
                    <Select
                        size='large'
                        placeholder={selectedService ? (encadrantList.length ? "Choisir un encadrant" : "Aucun encadrant disponible pour ce service") : "Veuillez d'abord choisir un service"}
                        className="w-full"
                        options={encadrantList}
                        disabled={!selectedService}
                        notFoundContent="Aucun encadrant disponible pour ce service"
                    />
                </Form.Item>

                {/* Start Date */}
                <Form.Item
                    label="Date de début"
                    name="startDate"
                    rules={[
                        { required: true, message: 'Veuillez sélectionner une date de début' },
                    ]}
                >
                    <DatePicker
                        format="DD/MM/YYYY" // Specify the date format you prefer
                        placeholder="Sélectionner la date de début"
                        className="w-full"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Date de fin"
                    name="endDate"
                    rules={[
                        { required: true, message: 'Veuillez sélectionner une date de fin' },
                    ]}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        placeholder="Sélectionner la date de fin"
                        className="w-full"
                        size="large"
                    />
                </Form.Item>
            </Form>
        </Modal>
        <h1 className="text-lg font-semibold mb-5">Les stagaires</h1>
        <Table
            loading={loading}
            columns={columns}
            dataSource={data}
            expandable={{
                expandRowByClick: false,
                rowExpandable: (record) => record.name !== 'Not Expandable',
                expandIcon: ({ expanded, onExpand, record }) => {
                    return expanded ? (
                        <span className="text-red-600">
                            <MinusCircleTwoTone twoToneColor="#f87171" className="text-lg/3" onClick={e => onExpand(record, e)} />
                        </span>
                    ) : (
                        <span className="text-red-600">
                            <PlusCircleTwoTone className="text-lg/3" onClick={e => onExpand(record, e)} />
                        </span>
                    );
                },
                expandedRowRender: (record) => <div style={{ margin: 0 }}>
                    <Descriptions title="Fiche de candidature" layout="horizontal" items={[
                        {
                            key: '1',
                            label: 'Nom et prénom',
                            children: record.details.fullname,
                        },
                        {
                            key: '2',
                            label: 'Date de naissance',
                            children: <Tag>{moment(record.details.date_naissance).format('DD/MM/YYYY')}</Tag>,
                        },
                        {
                            key: '3',
                            label: 'Sexe',
                            children: record.details.gender == 'male' ? <Tag color="blue">Homme</Tag> : <Tag color="pink">Femme</Tag>,
                        },
                        {
                            key: '4',
                            label: 'Nationalité',
                            children: record.details.nationality,
                        },
                        {
                            key: '5',
                            label: 'Adresse',
                            span: 2,
                            children: record.details.address,
                        },
                        {
                            key: '6',
                            label: record.cin ? 'CIN' : 'Passport',
                            children: <Tag color="green">{record.identity}</Tag>,
                        },
                        {
                            key: '7',
                            label: 'Téléphone',
                            children: <Tag>{record.details.phone}</Tag>,
                        },
                        {
                            key: '8',
                            label: 'Email',
                            children: <Tag>{record.details.email}</Tag>,
                        }
                    ]} />
                    <Divider></Divider>
                    <Descriptions layout="horizontal" items={[
                        {
                            key: '1',
                            span: 3,
                            label: record.details.etablissement ? 'Etablissement' : 'Etablissement (autre)',
                            children: record.details.etablissement ? record.details.etablissement.name : record.details.autre_etablissement,
                        },
                        {
                            key: '2',
                            label: "Spécialité",
                            children: record.details.specialty,
                        },
                        {
                            key: '2',
                            label: "Niveau",
                            children: record.details.niveau,
                        },
                        {
                            key: '3',
                            label: "Diplôme",
                            children: record.details.diplome,
                        },
                        {
                            key: '4',
                            label: "Type de stage",
                            children: <Tag color={record.type_stageColor}>{record.type_stageLabel}</Tag>,
                        },
                        {
                            key: '5',
                            label: "Durée (mois)",
                            span: 2,
                            children: <Tag>{record.details.stage_duration} mois</Tag>,
                        },
                        record.details.type_stage == "stage_pfe" ? {
                            key: '6',
                            label: "Proposition de sujet",
                            span: 3,
                            children: <Tag className="text-wrap">Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus tempore magni in suscipit porro obcaecati consectetur consequatur voluptatum dolores, sit sint repellendus omnis ullam libero culpa nihil minima corporis autem.</Tag>
                        } : { key: '6', span: 3, },
                        {
                            key: '7',
                            label: "Pièce Jointe",
                            span: 3,
                            children:
                                <Upload
                                    showUploadList={{
                                        showRemoveIcon: false,
                                    }}
                                    defaultFileList={record.details.attachments}
                                    itemRender={(_, file) => (
                                        <div className="file-item mb-1">
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="file-link hover:bg-slate-400"
                                            >
                                                <span className='flex items-center text-gray-700 hover:text-blue-500 hover:bg-blue-50'>
                                                    <PaperClipOutlined className='me-2' />{file.name}
                                                </span>
                                            </a>
                                        </div>
                                    )}
                                >
                                </Upload>
                        }
                    ]} />
                </div >,
            }}

        />
        {contextHolder}
    </>
};

export default Stagaires;