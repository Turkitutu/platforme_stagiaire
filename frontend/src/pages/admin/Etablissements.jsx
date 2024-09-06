import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, notification, Select, Space, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import api from '@/services/api';


const Etablissements = () => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const getEtablissements = async () => {
        try {
            const response = await api.get('/etablissement');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getEtablissements();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEtablissement, setSelectedEtablissement] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [alert, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        console.log(values);
        setLoadingSubmit(true);

        if (!selectedEtablissement) {
            api.post('/etablissement', values)
                .then(response => {
                    setData([...data, response.data]);
                    alert.success({
                        message: 'Niveau établissement',
                        description: 'Votre établissement a été ajouté avec succès',
                    });
                    setIsModalOpen(false);
                })
                .catch(error => {
                    console.error(error);
                    alert.error({
                        message: 'Erreur',
                        description:
                            'Erreur lors de l\'ajout de l\'établissement',
                    });
                })
                .finally(() => {
                    setLoadingSubmit(false);
                });
        } else {
            api.put(`/etablissement/${selectedEtablissement._id}`, values)
                .then(response => {
                    const index = data.findIndex(item => item._id === response.data._id);
                    const newData = [...data];
                    newData[index] = response.data;
                    setData(newData);
                    alert.success({
                        message: 'Établissement modifié',
                        description: 'Votre établissement a été modifié avec succès',
                    });
                    setSelectedEtablissement(null);
                    setLoadingSubmit(false);
                    setIsModalOpen(false);
                })
                .catch(error => {
                    console.error(error);
                    alert.error({
                        message: 'Erreur',
                        description:
                            'Erreur lors de la nom de l\'établissement',
                    });
                    setLoadingSubmit(false);
                })
        }
    };

    const confirmDelete = (record) => {
        Modal.confirm({
            title: 'Supprimer l\'établissement',
            content: 'Êtes-vous sûr de vouloir supprimer cet établissement ?',
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk: () => handleDelete(record),
        });
    }

    const handleDelete = (record) => {
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

    const handleEdit = (record) => {
        setSelectedEtablissement(record);
        form.setFieldValue('name', record.name);
        form.setFieldValue('category', record.category);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        form.setFieldValue('name', null);
        form.setFieldValue('category', null);
        setSelectedEtablissement(null);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setSelectedEtablissement(null);
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
            title: 'Les établissement',
            dataIndex: 'name',
            key: 'name',
            width: '70%',
            ...getColumnSearchProps('name', 'Rechercher un établissement'),
            sorter: (a, b) => a.name.length - b.name.length,
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Catégorie',
            dataIndex: 'category',
            key: 'category',
            width: '17%',
            showSorterTooltip: { target: 'full-header' },
            filters: [
                {
                    text: 'Établissements',
                    value: 'etablissement',
                },
                {
                    text: 'Centres de formation',
                    value: 'center',
                },
            ],
            onFilter: (value, record) => record.category.indexOf(value) === 0,
            sorter: (a, b) => a.category.length - b.category.length,
            render: (text, record) => <>{record.category == 'etablissement' ? <Tag color="cyan">Établissement</Tag> : <Tag color="gold">Centre de formation</Tag>}</>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => { handleEdit(record) }} icon={<EditOutlined />} shape="circle">

                    </Button>
                    <Button type="primary" onClick={() => { confirmDelete(record) }} danger icon={<DeleteOutlined />} shape="circle">

                    </Button>
                </Space>
            ),
        },
    ];

    return <>
        <Modal
            title={selectedEtablissement ? 'Modifier l\'établissement' : 'Ajouter un établissement'}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Annuler
                </Button>,
                <Button key="submit" type="primary" loading={loadingSubmit} onClick={() => form.submit()}>
                    {selectedEtablissement ? 'Modifier' : 'Ajouter'}
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ name: selectedEtablissement ? selectedEtablissement.name : '' }}
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
        <Button type="primary" onClick={handleAdd} className='mb-4' icon={<PlusCircleFilled />}>
            Ajouter un établissement
        </Button>
        <Table loading={loading} columns={columns} dataSource={data} />
        {contextHolder}
    </>
};

export default Etablissements;