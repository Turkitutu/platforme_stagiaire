import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, notification, Select, Space, Switch, Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import api from '@/services/api';

import { getUser } from '@/services/storage';


const Users = () => {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const user = getUser();

    const getUsers = async () => {
        try {
            const response = await api.get('/user');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [alert, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        if (!values.isAdmin) values.isAdmin = false;
        setLoadingSubmit(true);

        if (!selectedUser) {
            api.post('/user', values)
                .then(response => {
                    setData([...data, response.data]);
                    alert.success({
                        message: 'Niveau utilisateur ajouté',
                        description: 'Votre utilisateur a été ajouté avec succès',
                    });
                    setIsModalOpen(false);
                })
                .catch(error => {
                    console.error(error);
                    alert.error({
                        message: 'Erreur',
                        description:
                            'Erreur lors de l\'ajout du utilisateur.',
                    });
                })
                .finally(() => {
                    setLoadingSubmit(false);
                });
        } else {
            api.put(`/user/${selectedUser._id}`, values)
                .then(response => {
                    const index = data.findIndex(item => item._id === response.data._id);
                    const newData = [...data];
                    newData[index] = response.data;
                    setData(newData);
                    alert.success({
                        message: 'Service modifié',
                        description: 'Votre utilisateur a été modifié avec succès',
                    });
                    setSelectedUser(null);
                    setLoadingSubmit(false);
                    setIsModalOpen(false);
                })
                .catch(error => {
                    console.error(error);
                    alert.error({
                        message: 'Erreur',
                        description:
                            'Erreur lors de la modification du utilisateur.',
                    });
                    setLoadingSubmit(false);
                })
        }
    };

    const confirmDelete = (record) => {
        Modal.confirm({
            title: 'Supprimer le utilisateur',
            content: 'Êtes-vous sûr de vouloir supprimer ce utilisateur ?',
            okText: 'Supprimer',
            okType: 'danger',
            cancelText: 'Annuler',
            onOk: () => handleDelete(record),
        });
    }

    const handleDelete = (record) => {
        api.delete(`/user/${record._id}`)
            .then(() => {
                setData(data.filter(item => item._id !== record._id));
                alert.success({
                    message: 'Service supprimé',
                    description: 'Votre utilisateur a été supprimé avec succès',
                });
            })
            .catch(error => {
                console.error(error);
                alert.error({
                    message: 'Erreur',
                    description:
                        'Erreur lors de la suppression du utilisateur.',
                });
            });
    };

    const handleEdit = (record) => {
        setSelectedUser(record);
        form.setFieldValue('name', record.name);
        form.setFieldValue('email', record.email);
        console.log(record)
        form.setFieldValue('isAdmin', record.isAdmin);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        form.setFieldValue('name', null);
        form.setFieldValue('email', null);
        form.setFieldValue('isAdmin', null);
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setSelectedUser(null);
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
            title: "Nom d'utilisateur",
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name', 'Rechercher un utilisateur'),
            sorter: (a, b) => a.name.length - b.name.length,
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Email",
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('name', 'Rechercher un email'),
            sorter: (a, b) => a.email.length - b.email.length,
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Admin",
            dataIndex: 'isAdmin',
            key: 'isAdmin',
            sorter: (a, b) => a.isAdmin - b.isAdmin,
            render: (text, record) => <a>{record.isAdmin ? <Tag color="green">Oui</Tag> : <Tag>Non</Tag>}</a>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => { handleEdit(record) }} icon={<EditOutlined />} shape="circle">

                    </Button>
                    {
                        user._id != record._id && (
                            <Button type="primary" onClick={() => { confirmDelete(record) }} danger icon={<DeleteOutlined />} shape="circle"></Button>
                        )
                    }
                </Space>
            ),
        },
    ];

    return <>
        <Modal
            title={selectedUser ? 'Modifier le utilisateur' : 'Ajouter un utilisateur'}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Annuler
                </Button>,
                <Button key="submit" type="primary" loading={loadingSubmit} onClick={() => form.submit()}>
                    {selectedUser ? 'Modifier' : 'Ajouter'}
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Nom de l'utilisateur"
                    name="name"
                    rules={[
                        { required: true, message: 'Veuillez entrer le nom du utilisateur' },
                    ]}
                >
                    <Input size="small" placeholder="Entrez le nom de utilisateur" className=" border border-gray-300 rounded-md p-2" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Veuillez entrer l\'email' },
                        { type: 'email', message: 'Veuillez entrer un email valide' },
                    ]}
                >
                    <Input size="small" type="email" placeholder="Entrez le email" className=" border border-gray-300 rounded-md p-2" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Veuillez entrer le password' },
                    ]}
                >
                    <Input.Password size="small" placeholder="Entrez le password" className=" border border-gray-300 rounded-md p-2" />
                </Form.Item>
                <Form.Item
                    label="Rôle Administrateur"
                    name="isAdmin"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren="Admin"
                        unCheckedChildren="Utilisateur"
                        className="bg-green-500"
                    />
                </Form.Item>
            </Form>
        </Modal>
        <Button type="primary" onClick={handleAdd} className='mb-4' icon={<PlusCircleFilled />}>
            Ajouter un utilisateur
        </Button>
        <Table loading={loading} columns={columns} dataSource={data} />
        {contextHolder}
    </>
};

export default Users;