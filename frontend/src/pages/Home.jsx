import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined, LoginOutlined } from '@ant-design/icons';
import fb_logo from '../assets/facebook_logo.png';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

const LinkCard = ({ icon, image, title, text }) => {
    return (
        <>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center hover:cursor-pointer transition-transform duration-300 ease-in-out hover:translate-y-2">
                {icon && <div className="text-5xl mb-4">{icon}</div>}
                {image && <div className="flex justify-center mb-4"><img src={image} width={50} alt={title} /></div>}
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p>{text}</p>
            </div>
        </>
    )
}


const MainPage = () => {
    const navigate = useNavigate();


    const handleSubmitClick = () => {
        navigate('/demande_de_stage');
    }

    const handleCINClick = () => {
        navigate('/verify');
    }

    const [isSessionOpen, setIsSessionOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchSessionStatus = async () => {
        try {
            const response = await api.get('/session');
            setIsSessionOpen(response.data.isOpen);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'état de la session', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionStatus();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <div className="flex-1 flex flex-col justify-center items-center text-center bg-cover bg-center p-8"
            >
                <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg max-w-xl">
                    <h1 className="text-4xl font-bold text-blue-800 mb-4">Bienvenue sur le Platforme Stagiaire des Ciments de Bizerte</h1>
                    <p className="text-gray-700 mb-6">
                        Soumettez votre demande de stage ou vérifiez l'état de votre candidature.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <div className="flex flex-col items-center">
                            <Button
                                onClick={handleSubmitClick}
                                type="primary"
                                size="large"
                                className="bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                loading={loading}
                                disabled={!isSessionOpen}  // Disable button if session is closed
                            >
                                Soumettre une demande de stage <ArrowRightOutlined />
                            </Button>
                            {/* Conditional Message */}
                            {!isSessionOpen && !loading && (
                                <p className="text-red-500 mt-2">
                                    La session est fermée. Vous ne pouvez pas soumettre de demande de stage.
                                </p>
                            )}
                        </div>
                        <Button onClick={handleCINClick} size="large" className="bg-white text-blue-600 hover:bg-blue-50 border-blue-600 rounded-lg">
                            Connexion avec CIN <LoginOutlined />
                        </Button>
                    </div>
                </div>
            </div>

            <section className="w-full p-10 bg-white text-gray-800">
                <h2 className="text-3xl font-bold text-center mb-8">Explorez et Suivez-Nous</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <LinkCard icon="🌍" title="Notre site web" text="Découvrez notre site web pour plus d'informations." />
                    <LinkCard image={fb_logo} title="Suivez-nous sur Facebook" text="Rejoignez-nous sur notre page Facebook pour les dernières nouvelles." />
                    <LinkCard icon="📰" title="Actualités" text="Restez informé des dernières actualités et mises à jour." />
                </div>
            </section>

            <footer className="w-full bg-blue-600 text-white p-4 text-center">
                <p>&copy; 2024 Les Ciments de Bizerte. Tous Droits Réservés.</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <a href="#" className="hover:underline">Politique de Confidentialité</a>
                    <a href="#" className="hover:underline">Conditions d'Utilisation</a>
                    <a href="#" className="hover:underline">Nous Contacter</a>
                </div>
            </footer>
        </div>
    );
};

export default MainPage;
