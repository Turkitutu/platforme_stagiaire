import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, notification, Select, Space, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import api from '@/services/api';


const Encadrants = () => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [services, setServices] = useState([]);
    const [servicesFilters, setServicesFilters] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const getEncadrants = async () => {
        try {
            const response = await api.get('/encadrant');
            setData(response.data);
        } catch (error) {
            console.error(error);
            alert.error(
                {
                    message: 'Erreur',
                    description: 'Erreur lors du chargement des encadrants',
                }
            )
        }
    };

    const getServices = async () => {
        try {
            const response = await api.get('/service');
            setServices(response.data.map(service => ({
                label: service.name,
                value: service._id,
            })));
            const servicesFilters = response.data.map(service => ({
                text: service.name,
                value: service._id,
            }));
            setServicesFilters(servicesFilters);
        } catch (error) {
            console.error(error);
            alert.error(
                {
                    message: 'Erreur',
                    description: 'Erreur lors du chargement des services',
                }
            )
        }
    };

    const getData = async () => {
        await getServices();
        await getEncadrants();
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEncadrant, setSelectedEncadrant] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [alert, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        setLoadingSubmit(true);

        if (!selectedEncadrant) {
            api.post('/encadrant', values)
                .then(response => {
                    setData([...data, response.data]);
                    alert.success({
                        message: 'Niveau encadrant',
                        description: 'L\'encadrant a été ajouté avec succès',
                    });
                    setIsModalOpen(false);
                })
                .catch(error => {
                    console.error(error);
                    alert.error({
                        message: 'Erreur',
                        description:
                            'Erreur lors de l\'ajout de l\'encadrant',
                    });
                })
                .finally(() => {
                    setLoadingSubmit(false);
                });
        } else {
            api.put(`/encadrant/${selectedEncadrant._id}`, values)
                .then(response => {
                    const index = data.findIndex(item => item._id === response.data._id);
                    const newData = [...data];
                    newData[index] = response.data;
                    setData(newData);
                    alert.success({
                        message: 'Encadrant modifié',
                        description: 'L\'encadrant a été modifié avec succès',
                    });
                    setSelectedEncadrant(null);
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
            title: 'Supprimer l\'encadrant',
            content: 'Êtes-vous sûr de vouloir supprimer cet encadrant ?',
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk: () => handleDelete(record),
        });
    }

    const handleDelete = (record) => {
        api.delete(`/encadrant/${record._id}`)
            .then(() => {
                setData(data.filter(item => item._id !== record._id));
                alert.success({
                    message: 'Encadrant supprimé',
                    description: 'L\'encadrant a été supprimé avec succès',
                });
            })
            .catch(error => {
                console.error(error);
                alert.error({
                    message: 'Erreur',
                    description:
                        'Erreur lors de la suppression de l\'encadrant',
                });
            });
    };

    const handleEdit = (record) => {
        setSelectedEncadrant(record);
        form.setFieldValue('name', record.name);
        form.setFieldValue('service', record.service._id);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        form.setFieldValue('name', null);
        form.setFieldValue('service', null);
        setSelectedEncadrant(null);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setSelectedEncadrant(null);
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
            title: 'Les encadrants',
            dataIndex: 'name',
            key: 'name',
            width: '50%',
            ...getColumnSearchProps('name', 'Rechercher par nom'),
            sorter: (a, b) => a.name.length - b.name.length,
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Service',
            dataIndex: 'service.name',
            key: 'service.name',
            width: '35%',
            showSorterTooltip: { target: 'full-header' },
            filters: servicesFilters,
            onFilter: (value, record) => record.service._id.indexOf(value) === 0,
            sorter: (a, b) => a.service.name.length - b.service.name.length,
            render: (text, record) => <><Tag> {record.service.name}</Tag></>,
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
            title={selectedEncadrant ? 'Modifier l\'encadrant' : 'Ajouter un encadrant'}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Annuler
                </Button>,
                <Button key="submit" type="primary" loading={loadingSubmit} onClick={() => form.submit()}>
                    {selectedEncadrant ? 'Modifier' : 'Ajouter'}
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ name: selectedEncadrant ? selectedEncadrant.name : '' }}
            >
                <Form.Item
                    label="Nom de l'enacadrant"
                    name="name"
                    rules={[
                        { required: true, message: 'Veuillez entrer le nom de l\'encadrant' },
                    ]}
                >
                    <Input size="small" placeholder="Entrez le nom de l'encadrant" className="border border-gray-300 rounded-md p-2" />
                </Form.Item>

                <Form.Item
                    label="Service associé"
                    name="service"
                    rules={[
                        { required: true, message: 'Veuillez choisir un service pour l\'encadrant' },
                    ]}
                >
                    <Select
                        showSearch
                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        size='large'
                        placeholder="Choisir le service"
                        className="w-full"
                        options={services}
                    />
                </Form.Item>

            </Form>
        </Modal>
        <Button type="primary" onClick={handleAdd} className='mb-4' icon={<PlusCircleFilled />}>
            Ajouter un encadrant
        </Button>
        <Table loading={loading} columns={columns} dataSource={data} />
        {contextHolder}
    </>
};

export default Encadrants;