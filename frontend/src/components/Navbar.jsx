import { Button, Dropdown, Menu } from "antd";
import { useEffect, useState } from "react";
import 'antd/dist/reset.css';
import { DownOutlined, HomeOutlined, MailOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
import logo from '../assets/logo.jpg';


const Navbar = ({ fixed } = { fixed: false }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="0" icon={<HomeOutlined />}>
        <a href="#">Accueil</a>
      </Menu.Item>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <a href="#">Demande de Stage</a>
      </Menu.Item>
      <Menu.Item key="2" icon={<MailOutlined />}>
        <a href="#">Instructions</a>
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />}>
        <a href="#">Contact</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className={`w-full p-4 top-0 z-50 transition-all duration-300 bg-blue-600 shadow-lg flex justify-between items-center` + (fixed ? ' fixed' : '')}>
      <div className="text-lg font-bold text-white cursor-pointer" onClick={() => window.location.href = '/'}>
        {/* <div className="flex items-center">
          <img src={logo} alt="Les Ciments de Bizerte" className="h-12 mr-4" />
          <span className="text-white text-2xl font-bold">Les Ciments de Bizerte <p className="text-sm font-medium text-white">Platforme Stagiaire</p></span>
        </div> */}
        Stream
      </div>


      <div className="hidden md:flex space-x-6 items-center">

        <a href="#" className="text-white hover:text-blue-300 transition-colors duration-200">Accueil</a>
        <a href="#" className="text-white hover:text-blue-300 transition-colors duration-200">Demande de Stage</a>
        <a href="#" className="text-white hover:text-blue-300 transition-colors duration-200">Contact</a>

        {/* <BellOutlined className="text-white hover:text-blue-300 cursor-pointer" /> */}
        <Dropdown overlay={menu} trigger={['click']}>
          <Button className="bg-green-500 border-none text-white hover:bg-green-600">
            Login <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      <div className="md:hidden">
        <Dropdown overlay={menu} trigger={['click']}>
          <Button className="bg-white border-none text-blue-400 hover:text-blue-300">
            Menu <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </header>
  );
};


export default Navbar;
