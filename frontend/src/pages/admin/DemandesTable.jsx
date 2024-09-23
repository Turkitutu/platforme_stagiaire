import { useEffect, useRef, useState } from 'react';
import { Button, Descriptions, Divider, Form, Input, Modal, notification, Select, Space, Table, Tag, Upload } from 'antd';
import { SearchOutlined, PaperClipOutlined, CheckOutlined, CloseOutlined, PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import api from '@/services/api';
import moment from 'moment';

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

const StageDemandes = () => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const getStageDemandes = async () => {
        try {
            const response = await api.get('/demande_stage');
            const data = response.data.map((item) => {
                return {
                    ...item,
                    identity: String(item.cin) || String(item.passport),
                    fullname: `${item.first_name} ${item.last_name}`,
                    type_stageLabel: stageTypes[item.type_stage],
                    type_stageColor: stageTypesColors[item.type_stage],
                    attachments: item.attachments.map((path) => {
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
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getStageDemandes();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState(null);

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
        api.delete(`/etablissement/${record._id}`)
            .then(() => {
                setData(data.filter(item => item._id !== record._id));
                alert.success({
                    message: 'Etablissement supprimé',
                    description: 'Votre établissement a été supprimé avec succès',
                });
            })
            .catch(error => {
                console.error(error);
                alert.error({
                    message: 'Erreur',
                    description:
                        'Erreur lors de la suppression de l\'établissement',
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

    const onFinish = (values) => {
        handleSubmit(values);
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
            title: 'CIN/Passport',
            dataIndex: 'identity',
            key: 'identity',
            width: '20%',
            ...getColumnSearchProps('identity', 'Rechercher par CIN/Passport'),
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Nom et prénom',
            dataIndex: 'fullname',
            key: 'fullname',
            width: '20%',
            onFilter: (value, record) => record.fullname.indexOf(value) === 0,
            ...getColumnSearchProps('fullname', 'Rechercher par nom et prénom'),
        },
        {
            title: 'Type de stage',
            dataIndex: 'type_stageLabel',
            key: 'type_stageLabel',
            width: '20%',
            onFilter: (value, record) => record.type_stageLabel.indexOf(value) === 0,
            showSorterTooltip: { target: 'full-header' },
            filters: Object.keys(stageTypes).map((key) => ({ text: stageTypes[key], value: key })),
            sorter: (a, b) => a.type_stageLabel.length - b.type_stageLabel.length,
            render: (text, record) => <Tag color={record.type_stageColor}>{text}</Tag>
        },
        {
            title: 'Durée (mois)',
            dataIndex: 'stage_duration',
            key: 'stage_duration',
            width: '14%',
            onFilter: (value, record) => record.stage_duration.indexOf(value) === 0,
            sorter: (a, b) => a.stage_duration.length - b.stage_duration.length,
            render: (text) => <div className='flex justify-center'><Tag>{text} mois</Tag></div>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle" >
                    <Button
                        className='p-3 rounded-md text-lime-600'
                        onClick={() => { handleAccept(record) }}
                        icon={<CheckOutlined />}
                        size="small"
                        style={{ borderColor: '#52c41a' }} // Ant Design success color
                    >
                        Accepter
                    </Button>
                    <Button
                        onClick={() => { confirmReject(record) }}
                        className='p-3 rounded-md'
                        icon={<CloseOutlined />}
                        color="default"
                        variant="dashed"
                        size="small"
                        danger
                    >
                        Rejeter
                    </Button>

                </Space >
            ),
        },
    ];

    return <>
        <Modal
            title={<>Accepter la demande de <span className='text-lime-600'>{selectedDemande ? selectedDemande.fullname : ''}</span></>}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Annuler
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                    {selectedDemande ? 'Modifier' : 'Ajouter'}
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ name: selectedDemande ? selectedDemande.name : '' }}
            >
                <Form.Item
                    label="Nom de l'établissement"
                    name="name"
                    rules={[
                        { required: true, message: 'Veuillez entrer le nom de l\'établissement' },
                    ]}
                >
                    <Input size="small" placeholder="Entrez le nom de l'établissement" className="border border-gray-300 rounded-md p-2" />
                </Form.Item>

                <Form.Item
                    label="Catégorie"
                    name="category"
                    rules={[
                        { required: true, message: 'Veuillez choisir la catégorie de l\'établissement' },
                    ]}
                >
                    <Select
                        size='large'
                        placeholder="Choisir la catégorie"
                        defaultValue="etablissement"
                        className="w-full"
                        options={[
                            { label: 'Établissement', value: 'etablissement' },
                            { label: 'Centre de formation', value: 'center' },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
        <h1 className="text-lg font-semibold mb-5">Les demandes</h1>
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
                            children: record.fullname,
                        },
                        {
                            key: '2',
                            label: 'Date de naissance',
                            children: <Tag>{moment(record.date_naissance).format('DD/MM/YYYY')}</Tag>,
                        },
                        {
                            key: '3',
                            label: 'Sexe',
                            children: record.gender == 'male' ? <Tag color="blue">Homme</Tag> : <Tag color="pink">Femme</Tag>,
                        },
                        {
                            key: '4',
                            label: 'Nationalité',
                            children: record.nationality,
                        },
                        {
                            key: '5',
                            label: 'Adresse',
                            span: 2,
                            children: record.address,
                        },
                        {
                            key: '6',
                            label: record.cin ? 'CIN' : 'Passport',
                            children: <Tag color="green">{record.identity}</Tag>,
                        },
                        {
                            key: '7',
                            label: 'Téléphone',
                            children: <Tag>{record.phone}</Tag>,
                        },
                        {
                            key: '8',
                            label: 'Email',
                            children: <Tag>{record.email}</Tag>,
                        }
                    ]} />
                    <Divider></Divider>
                    <Descriptions layout="horizontal" items={[
                        {
                            key: '1',
                            span: 3,
                            label: record.etablissement ? 'Etablissement' : 'Etablissement (autre)',
                            children: record.etablissement ? record.etablissement.name : record.autre_etablissement,
                        },
                        {
                            key: '2',
                            label: "Spécialité",
                            children: record.specialty,
                        },
                        {
                            key: '2',
                            label: "Niveau",
                            children: record.niveau,
                        },
                        {
                            key: '3',
                            label: "Diplôme",
                            children: record.diplome,
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
                            children: <Tag>{record.stage_duration} mois</Tag>,
                        },
                        record.type_stage == "stage_pfe" ? {
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
                                    defaultFileList={record.attachments}
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

export default StageDemandes;