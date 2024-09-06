import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, notification, Select, Space, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import api from '@/services/api';


const Services = () => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const getServices = async () => {
        try {
            const response = await api.get('/service');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getServices();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [alert, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        console.log(values);
        setLoadingSubmit(true);

        if (!selectedService) {
            api.post('/service', values)
                .then(response => {
                    setData([...data, response.data]);
                    alert.success({
                        message: 'Niveau service ajouté',
                        description: 'Votre service a été ajouté avec succès',
                    });
                    setIsModalOpen(false);
                })
                .catch(error => {
                    console.error(error);
                    alert.error({
                        message: 'Erreur',
                        description:
                            'Erreur lors de l\'ajout du service.',
                    });
                })
                .finally(() => {
                    setLoadingSubmit(false);
                });
        } else {
            api.put(`/service/${selectedService._id}`, values)
                .then(response => {
                    const index = data.findIndex(item => item._id === response.data._id);
                    const newData = [...data];
                    newData[index] = response.data;
                    setData(newData);
                    alert.success({
                        message: 'Service modifié',
                        description: 'Votre service a été modifié avec succès',
                    });
                    setSelectedService(null);
                    setLoadingSubmit(false);
                    setIsModalOpen(false);
                })
                .catch(error => {
                    console.error(error);
                    alert.error({
                        message: 'Erreur',
                        description:
                            'Erreur lors de la modification du service.',
                    });
                    setLoadingSubmit(false);
                })
        }
    };

    const confirmDelete = (record) => {
        Modal.confirm({
            title: 'Supprimer le service',
            content: 'Êtes-vous sûr de vouloir supprimer ce service ?',
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk: () => handleDelete(record),
        });
    }

    const handleDelete = (record) => {
        api.delete(`/service/${record._id}`)
            .then(() => {
                setData(data.filter(item => item._id !== record._id));
                alert.success({
                    message: 'Service supprimé',
                    description: 'Votre service a été supprimé avec succès',
                });
            })
            .catch(error => {
                console.error(error);
                alert.error({
                    message: 'Erreur',
                    description:
                        'Erreur lors de la suppression du service.',
                });
            });
    };

    const handleEdit = (record) => {
        setSelectedService(record);
        form.setFieldValue('name', record.name);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        form.setFieldValue('name', null);
        setSelectedService(null);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setSelectedService(null);
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
            title: 'Les services',
            dataIndex: 'name',
            key: 'name',
            width: '80%',
            ...getColumnSearchProps('name', 'Rechercher un service'),
            sorter: (a, b) => a.name.length - b.name.length,
            render: (text) => <a>{text}</a>,
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
            title={selectedService ? 'Modifier le service' : 'Ajouter un service'}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Annuler
                </Button>,
                <Button key="submit" type="primary" loading={loadingSubmit} onClick={() => form.submit()}>
                    {selectedService ? 'Modifier' : 'Ajouter'}
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ name: selectedService ? selectedService.name : '' }}
            >
                <Form.Item
                    label="Nom de le service"
                    name="name"
                    rules={[
                        { required: true, message: 'Veuillez entrer le nom du service' },
                    ]}
                >
                    <Input size="small" placeholder="Entrez le nom de service" className=" border border-gray-300 rounded-md p-2" />
                </Form.Item>
            </Form>
        </Modal>
        <Button type="primary" onClick={handleAdd} className='mb-4' icon={<PlusCircleFilled />}>
            Ajouter un service
        </Button>
        <Table loading={loading} columns={columns} dataSource={data} />
        {contextHolder}
    </>
};

export default Services;