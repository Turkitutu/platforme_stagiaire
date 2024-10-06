import { Button, Dropdown, Menu } from "antd";
import { useEffect, useState } from "react";
import 'antd/dist/reset.css';
import { DownOutlined, HomeOutlined, UserOutlined, LoginOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import logo from '../assets/logo.jpg';
import { Link, useNavigate } from "react-router-dom";

import { getToken, getUser } from '../services/storage';

const Navbar = ({ fixed } = { fixed: false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  const navigateToLogin = () => {
    navigate('/login');
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (getUser())
      setUsername(getUser().name);
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="0" icon={<HomeOutlined />}>
        <Link to="/">Accueil</Link>
      </Menu.Item>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/demande_de_stage">Demande de Stage</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<SettingOutlined />}>
        <Link to="/dashboard">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<LogoutOutlined />}>
        <Link to="/logout">Logout</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className={`w-full p-4 top-0 z-50 transition-all duration-300 bg-blue-600 shadow-lg flex justify-between items-center` + (fixed ? ' fixed' : '')}>
      <div className="text-lg font-bold text-white cursor-pointer" onClick={() => window.location.href = '/'}>
        <div className="flex items-center">
          <img src={logo} alt="Les Ciments de Bizerte" className="h-12 mr-4" />
          <span className="text-white text-2xl font-bold">Les Ciments de Bizerte <p className="text-sm font-medium text-white">Platforme Stagiaire</p></span>
        </div>
      </div>


      <div className="hidden md:flex space-x-6 items-center">

        <Link to="/" className="text-white hover:text-blue-300 transition-colors duration-200">Accueil</Link>
        <Link to="/demande_de_stage" className="text-white hover:text-blue-300 transition-colors duration-200">Demande de Stage</Link>

        {/* <BellOutlined className="text-white hover:text-blue-300 cursor-pointer" /> */}

        {getToken() ? (

          <Dropdown overlay={menu} trigger={['click']}>
            <Button className="bg-white border-none text-blue-400 hover:bg-green-600">
              {username} <DownOutlined />
            </Button>
          </Dropdown>)
          :
          (<Button onClick={navigateToLogin} className="text-white bg-transparent hover:bg-transparent border-white border-1 hover:border-white">
            Administration <LoginOutlined />
          </Button>)
        }
      </div>

      <div className="md:hidden">
        {getToken() ? (

          <Dropdown overlay={menu} trigger={['click']}>
            <Button className="bg-white border-none text-blue-400 hover:bg-green-600">
              {username} <DownOutlined />
            </Button>
          </Dropdown>)
          :
          (<Button type="link" onClick={navigateToLogin} className="text-white bg-transparent hover:bg-transparent border-white border-1 hover:border-white">
            Administration <LoginOutlined />
          </Button>)
        }
      </div>
    </header>
  );
};


export default Navbar;
