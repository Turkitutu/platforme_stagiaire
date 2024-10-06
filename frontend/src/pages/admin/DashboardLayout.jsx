import React, { useEffect, useState } from 'react';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getUser } from '@/services/storage';

const { Content, Sider } = Layout;


const AccessVerifier = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = getUser();

        if (!user) {
            navigate("/login");
        }
    }, []);

    return null;
}


const sidebarData = [
    {
        key: 'dashboard',
        icon: React.createElement(UserOutlined),
        label: `Dashboard`,
        children: [
            {
                key: 'demandes',
                label: `Demandes de stage`,
                path: '/dashboard/demandes',
            },
            {
                key: 'stagaires',
                label: `Stagaires`,
                path: '/dashboard/stagaires',
            },
            {
                key: 'encadrants',
                label: `Encadrants`,
                path: '/dashboard/encadrants'
            }
        ]
    },
    {
        key: 'parameters',
        icon: React.createElement(SettingOutlined),
        label: `Paramètres`,
        children: [

            {
                key: 'services',
                label: `Les services`,
                path: '/dashboard/services',
            },
            {
                key: 'etablissements',
                label: `Les établissements`,
                path: '/dashboard/etablissements',
            }
        ]
    }
]


const DashboardLayout = () => {
    const [breadcrumbItems, setBreadcrumbItems] = useState(["Dashboard", "Demandes de stage"]);
    const [selectedKeys, setSelectedKeys] = useState(['demandes']);
    const navigate = useNavigate();
    const location = useLocation();

    const user = getUser();



    useEffect(() => {
        sidebarData.map(item => {
            item.children.map(child => {
                if (child.path === location.pathname) {
                    setBreadcrumbItems([item.label, child.label]);
                    setSelectedKeys([child.key]);
                }
            })
        });
    }, [location]);

    const handleMenuChange = (e) => {
        const cat = sidebarData.find(item => item.key === e.keyPath[1]);
        const item = cat.children.find(item => item.key === e.key);

        setBreadcrumbItems([cat.label, item.label]);

        navigate(item.path);
    }

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            <AccessVerifier />
            {user && (<>
                <Navbar fixed={false} />
                <div className="min-h-screen bg-gray-100">
                    <Layout style={{ minHeight: '100vh' }}>
                        <Layout>
                            <Sider width={200} style={{ background: colorBgContainer }}>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={selectedKeys}
                                    key={selectedKeys[0]}
                                    defaultOpenKeys={['dashboard', 'parameters']}
                                    style={{ height: '100%', borderRight: 0 }}
                                    items={sidebarData}
                                    onClick={handleMenuChange}
                                />
                            </Sider>
                            <Layout style={{ padding: '0 24px 24px' }}>
                                <Breadcrumb style={{ margin: '16px 0' }}>
                                    {breadcrumbItems.map((item, index) => (
                                        <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
                                    ))}
                                </Breadcrumb>
                                <Content
                                    style={{
                                        padding: 24,
                                        margin: 0,
                                        minHeight: 280,
                                        background: colorBgContainer,
                                        borderRadius: borderRadiusLG,
                                    }}
                                >
                                    <Outlet />
                                </Content>
                            </Layout>
                        </Layout>
                    </Layout>
                </div></>
            )
            }
        </>
    );
};

export default DashboardLayout;