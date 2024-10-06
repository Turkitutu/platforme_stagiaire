import React from 'react';
import { Button, Input, Form, notification } from 'antd';
import logo from '../assets/logo.jpg';
import api from '@/services/api';
import { login } from '@/services/storage';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const [alert, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    const onFinish = async (values) => {

        try {
            const response = await api.post('/auth/login', { email: values.email, password: values.password });
            if (response.data.token) {
                login(response.data.token, response.data.user);
                navigate('/dashboard');
            }

        } catch (error) {
            console.log(error);
            alert.error({
                message: "Identifiants incorrects",
                description: 'Email ou mot de passe incorrect !',
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* Logo and Platform Title */}
            <div className="flex items-center mb-8 h-24">
                <div className='rounded-s-lg bg-white'>
                    <img src={logo} alt="Les Ciments de Bizerte" className="h-24 mx-2" />
                </div>
                <div className='rounded-e-lg p-5 px-4 bg-blue-600'>
                    <h1 className="text-3xl font-bold text-white">Les Ciments de Bizerte</h1>
                    <p className="text-sm text-white">Platforme Stagiaire</p>
                </div>
            </div>

            {/* Login Form */}
            <div className="bg-white p-8 shadow-lg rounded-lg max-w-sm w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Administration</h2>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="email"
                        rules={[{
                            required: true, message: 'Veuillez saisir votre nom d\'utilisateur !'
                        }]}
                    >
                        <Input placeholder="email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Veuillez saisir votre mot de passe !' }]}
                    >
                        <Input.Password placeholder="Mot de passe" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full bg-green-500 border-none hover:bg-green-600 mt-2">
                            Se connecter
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            {contextHolder}
        </div >

    );
};

export default LoginPage;