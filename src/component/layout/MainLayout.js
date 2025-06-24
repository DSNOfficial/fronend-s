import React, { useEffect, useState } from 'react';
import {
  DashboardOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  FundViewOutlined,
  LogoutOutlined,
  RetweetOutlined,
  UserOutlined,
  FormOutlined,
  SnippetsOutlined,
  CopyOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Button, Space, Spin, message } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/image/logo.png';
import ProfileImage from '../assets/image/user_50px.png';
import { getRoleMenu, getUser, isLogin, logout,Config } from '../../config/helper';


import FlagKH from '../assets/flags/kh.png';


import FlagUS from '../assets/flags/us.png';
  import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/km';

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [language, setLanguage] = useState('KH');
  const [loading, setLoading] = useState(false);
  const [itemsMenu, setItemsMenu] = useState([]);
  const [logoutLoading, setLogoutLoading] = useState(false);



  dayjs.extend(localizedFormat);
  dayjs.locale('km'); // Set locale to Khmer

  {logoutLoading && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(2px)',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <Spin size="large" />
      <div style={{ marginTop: 16, fontSize: 16, color: '#333' }}>
        ប្រព័ន្ធដំណើរការចាកចេញ...
      </div>
    </div>
  </div>
)}



  const user = getUser();
  const permission_menu = getRoleMenu() || []; // ✅ Prevent undefined

  // Redirect if not logged in
  useEffect(() => {

    
    if (!isLogin()) {
      navigate('/');
    }
    const itemsMenuAll = generateMenuItems(language);
    const updatedMenu = itemsMenuAll
      .map(item => {
        if (item.children) {
          const filteredChildren = item.children.filter(child =>
            permission_menu.some(p => p.route === child.key)
          );
          return filteredChildren.length ? { ...item, children: filteredChildren } : null;
        } else {
          return permission_menu.some(p => p.route === item.key) ? item : null;
        }
      })
      .filter(Boolean);

    setItemsMenu(updatedMenu);
  }, [navigate],[language, permission_menu]);


  const generateMenuItems = (lang) => {
    return [
  
      {
        key: 'home',
        icon: <DashboardOutlined />,
        label: lang === 'KH' ? 'ផ្ទាំងគ្រប់គ្រង' : 'Dashboard',
      },
      {
        key: 'person',
        icon: <CopyOutlined />,
       
        label: lang === 'KH' ? 'ទិន្នន័យម៉ូតូបុគ្គលិក' : 'Motor Person Data',
      },
      {
        key: 'depart',
        icon: <FormOutlined />,
        label: lang === 'KH' ? 'ការិ./ផ្នែក/ឯកជន' : 'Departments',
      },
        {
        key: 'model',
        icon: <InfoCircleOutlined />,
        label: lang === 'KH' ? 'ម៉ូឌែម៉ូតូ' : 'Model Motor',
      },

      ,
        {
        key: 'province',
        icon: <SnippetsOutlined />,
        label: lang === 'KH' ? 'ខេ​ត្ត/ក្រុង/កម្ពុជា' : 'Cambodia Pronvice',
      },
        {
        key: 'AI',
        icon: <ApartmentOutlined />,
      
        label: lang === 'KH' ? ' បញ្ញាសិប្បនិម្មិតវិភាគ' : 'Analysiz AI',
      },
      
      {
        key: 'sub3',
        icon: < UserOutlined/>,
        label: lang === 'KH' ? 'បង្កើតគណនី' : 'System',
        children: [
          {
            key: 'user-page',
            icon: <UsergroupAddOutlined />,
            
            label: lang === 'KH' ? 'គណនីប្រើប្រាស់' : 'User',
          },
          {
            key: 'role-page',
            icon: <SettingOutlined />,
          
            label: lang === 'KH' ? 'កំណត់តួនាទី' : 'Role',
          },
        ],
      },
    ];
  };



  const onClickMenu = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/home');
    } else {
      navigate(key);
    }
  };



  // const handleLanguageChange = (lang) => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLanguage(lang);
  //     setLoading(false);
  //     message.success(`Language changed to ${lang === 'KH' ? 'Khmer' : 'English'}`);
  //   }, 300);
  // };

  // const languageMenu = (
  //   <Menu>
  //     {/* <Menu.Item key="kh" onClick={() => handleLanguageChange('KH')}>
  //       <Space>
  //         <img src={FlagKH} alt="KH" style={{ width: 20 }} />
  //         ខ្មែរ
  //       </Space>
  //     </Menu.Item>
  //     <Menu.Item key="en" onClick={() => handleLanguageChange('EN')}>
  //       <Space>
  //         <img src={FlagUS} alt="EN" style={{ width: 20 }} />
  //         EN
  //       </Space>
  //     </Menu.Item> */}
  //   </Menu>
  // );

  if (!user) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <Spin tip="Loading user..." size="large" />
      </div>
    );
  }

  const toKhmerNumber = (number) => {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return number.toString().split('').map(char => {
    return /\d/.test(char) ? khmerDigits[+char] : char;
  }).join('');
};

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['home']} onClick={onClickMenu}>
          {itemsMenu.map((item) =>
            item.children ? (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map((child) => (
                  <Menu.Item key={child.key} icon={child.icon}>
                    {child.label}
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider> */}
     <Sider
  collapsible
  collapsed={collapsed}
  onCollapse={(value) => setCollapsed(value)}
  style={{
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflow: 'auto',
  }}
>
  {/* Logo section */}
  <div
    style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
    }}
  >
    <img
      src={Logo} // ✅ make sure Logo is imported correctly
      alt="Logo"
      style={{
        width: collapsed ? 40 : 220,
        transition: 'width 0.3s',
        objectFit: 'contain',
      }}
    />
  </div>

  {/* Menu section */}
  <Menu theme="dark" mode="inline" defaultSelectedKeys={['home']} onClick={onClickMenu}>
    {itemsMenu.map((item) =>
      item.children ? (
        <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
          {item.children.map((child) => (
            <Menu.Item key={child.key} icon={child.icon}>
              {child.label}
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      ) : (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      )
    )}
  </Menu>
</Sider>

      <Layout>
       <Header style={{
  position: 'sticky',   // make it sticky
  top: 0,               // stick to top
  zIndex: 1000,         // high z-index so it's above other content
  background: '#fff',
  padding: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingInline: 25,
  boxShadow: '0 2px 8px #f0f1f2'  // optional: subtle shadow
}}>

          <div style={{ display: 'flex', alignItems: 'center' }}>
           <span style={{ fontSize: 15, fontWeight: 'bold', transition: 'all 0.3s ease-in-out' }}>
  {dayjs().format('ថ្ងៃdddd, D MMMM YYYY')}
</span>

            
           {/* <img src={Logo} alt="Logo" style={{ width: 200, objectFit: 'contain' }} /> */}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 15 }}>
  {/* Cambodia flag */}
 

  {/* User info text */}
  <div style={{ textAlign: 'right' }}>
    <div className="txt_normal" style={{ fontSize: 14, textAlign: 'right', lineHeight: 1.6 }}>
      <div style={{ marginTop: 2 }}>
         <img
      src={FlagKH}
      alt="Cambodia Flag"
      style={{
        width: 24,
        height: 16,
        objectFit: 'contain',
        borderRadius: 2,
      }}
    />
    {user?.RoleCode || 'User'}    
   
  </div>
  <div>សួស្តី {user?.lastName || 'User'}!</div>
  
</div>

  </div>

  {/* Profile image */}
  <img
    src={user?.image ? `${Config.image_path}${user.image}` : ProfileImage}
    alt="User Profile"
    style={{
      width: 48,
      height: 48,
      objectFit: 'cover',
      borderRadius: '50%',
      border: '1px solid #ddd',
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
    }}
  />


<Button
  type="primary"
  size="small"
  icon={<LogoutOutlined />}
  loading={logoutLoading}
  style={{
    marginLeft: 15,
    backgroundColor: '#ff4d4f',
    borderColor: '#ff4d4f',
    borderRadius: '10px',
  }}
  onClick={() => {
    setLogoutLoading(true);
    const hide = message.loading('ប្រព័ន្ធដំណើរការចាកចេញ...', 0);
    setTimeout(() => {
      hide();
      logout();
      navigate('/');
    }, 1000);
  }}
>
  ចាកចេញ
</Button>

</div>

        </Header>
        {/* <Content style={{ margin: '16px', background: '#fff', padding: 24 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin size="large" tip="Loading..." />
            </div>
          ) : (
            <Outlet />
          )}
        </Content> */}

        <Content
  style={{
    margin: '16px',
    background: '#fff',
    padding: 24,
    filter: logoutLoading ? 'blur(2px)' : 'none', // 👈 blur when logging out
    pointerEvents: logoutLoading ? 'none' : 'auto', // disable interaction
  }}
>
  {loading ? (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Spin size="large" tip="Loading..." />
    </div>
  ) : (
    <Outlet />
  )}
</Content>

      </Layout>
    </Layout>
  );
};

export default MainLayout;
